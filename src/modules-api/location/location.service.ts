import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import {
  deleteImageFromCloudinary,
  uploadImageToCloudinary,
} from 'src/common/multer/cloud.config';
import { buildQueryPrismaLocation } from 'src/common/helpers/build-query-prisma-location-helper';
import { LocationDto } from './dto/location.dto';
import { QueryLocationDto } from './dto/query-location.dto';

@Injectable()
export class LocationService {
  constructor(private readonly prisma: PrismaService) { }

  async createLocation(body: LocationDto, file?: Express.Multer.File) {
    const { ten_vi_tri, tinh_thanh, quoc_gia } = body;

    if (!ten_vi_tri || !tinh_thanh || !quoc_gia) {
      throw new BadRequestException(
        'Tên vị trí, tỉnh thành và quốc gia không được để trống',
      );
    }

    const existingLocation = await this.prisma.viTri.findFirst({
      where: {
        ten_vi_tri: ten_vi_tri,
        tinh_thanh: tinh_thanh,
        quoc_gia: quoc_gia,
        isDeleted: false,
      },
    });

    if (existingLocation) {
      throw new BadRequestException('Tên vị trí đã tồn tại');
    }

    if (file && !file.mimetype.startsWith('image/')) {
      throw new BadRequestException('File phải là hình ảnh');
    }

    const hinhAnh = file ? await uploadImageToCloudinary(file) : undefined;

    return this.prisma.viTri.create({
      data: {
        ten_vi_tri: ten_vi_tri,
        tinh_thanh: tinh_thanh,
        quoc_gia: quoc_gia,
        hinh_anh: hinhAnh,
      },
    });
  }

  async findAllLocation(query: QueryLocationDto) {
    const { skip, page, pageSize, where, hasPagination, take } =
      buildQueryPrismaLocation(query);

    const queryOptions: any = {
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        Phong: true,
      },
    };

    if (hasPagination) {
      queryOptions.skip = skip;
      queryOptions.take = take;
    }

    const [items, totalItem] = await Promise.all([
      this.prisma.viTri.findMany(queryOptions),
      this.prisma.viTri.count({ where }),
    ]);

    const totalPage = hasPagination ? Math.ceil(totalItem / pageSize) : 1;

    return {
      message: 'Lấy danh sách vị trí thành công',
      totalItem,
      totalPage,
      page: hasPagination ? page : 1,
      pageSize: hasPagination ? pageSize : totalItem,
      items,
    };
  }

  async findByIdLocation(id: number) {
    const item = await this.prisma.viTri.findFirst({
      where: {
        id: id,
        isDeleted: false,
      },
      include: {
        Phong: true,
      },
    });

    if (!item) {
      throw new BadRequestException('không tìm thấy vị trí');
    }

    return {
      message: 'Lấy chi tiết vị trí thành công',
      item,
    };
  }

  async updateLocation(
    body: LocationDto,
    id: number,
    file?: Express.Multer.File,
  ) {
    const { ten_vi_tri, tinh_thanh, quoc_gia } = body;

    const existingLocation = await this.prisma.viTri.findFirst({
      where: {
        id: id,
        isDeleted: false,
      },
    });

    if (!existingLocation) {
      throw new BadRequestException('Không tìm thấy vị trí');
    }

    if (file && !file.mimetype.startsWith('image/')) {
      throw new BadRequestException('File phải là hình ảnh');
    }

    const duplicateLocation = await this.prisma.viTri.findFirst({
      where: {
        ten_vi_tri: ten_vi_tri,
        tinh_thanh: tinh_thanh,
        quoc_gia: quoc_gia,
        isDeleted: false,
        id: { not: id },
      },
    });

    if (duplicateLocation) {
      throw new BadRequestException('Tên vị trí đã tồn tại');
    }

    const oldImageUrl = existingLocation.hinh_anh;
    const hinhAnh = file ? await uploadImageToCloudinary(file) : undefined;

    const item = await this.prisma.viTri.update({
      where: { id: id },
      data: {
        ten_vi_tri: ten_vi_tri,
        tinh_thanh: tinh_thanh,
        quoc_gia: quoc_gia,
        ...(hinhAnh && { hinh_anh: hinhAnh }),
      },
    });

    if (hinhAnh && oldImageUrl && oldImageUrl !== hinhAnh) {
      try {
        await deleteImageFromCloudinary(oldImageUrl);
      } catch (error) {
        console.error('Delete old location image failed:', error);
      }
    }

    return {
      message: 'Cập nhật vị trí thành công',
      item,
    };
  }

  async uploadImageLocation(id: number, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn file');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('File phải là hình ảnh');
    }

    const location = await this.prisma.viTri.findFirst({
      where: {
        id: id,
        isDeleted: false,
      },
    });

    if (!location) {
      throw new BadRequestException('Vị trí không tồn tại');
    }

    const hinhAnh = await uploadImageToCloudinary(file);

    return this.prisma.viTri.update({
      where: { id },
      data: {
        hinh_anh: hinhAnh,
      },
    });
  }

  async deleteLocation(id: number) {
    const existingLocation = await this.prisma.viTri.findFirst({
      where: {
        id: id,
      },
    });

    if (!existingLocation) {
      throw new BadRequestException('không tìm thấy id vị trí');
    }
    const imgUrl = await existingLocation.hinh_anh
    const deleteLocations = await this.prisma.viTri.delete({
      where: {
        id: id,
      },
    });
    if (imgUrl) {
      try {
        await deleteImageFromCloudinary(imgUrl)
      } catch (error) {
        console.error('xóa ảnh phòng thất bại', error);
      }
    }
    return {
      message: 'Xóa vị trí thành công',
      item: deleteLocations,
    };
  }
}
