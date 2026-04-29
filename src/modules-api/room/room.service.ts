import { BadRequestException, Injectable } from '@nestjs/common';
import { RoomDto } from './dto/room.dto';
//import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import {
  deleteImageFromCloudinary,
  uploadImageToCloudinary,
} from 'src/common/multer/cloud.config';
import { QueryRoomDto } from './dto/query-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { buildQueryPrismaRoom } from 'src/common/helpers/build-query-prisma-room-helper'
@Injectable()
export class RoomService {

  constructor(private prisma: PrismaService) { }

  async createRoom(body: RoomDto, file?: Express.Multer.File) {
    const {
      ten_phong, khach, phong_ngu, giuong, phong_tam, mo_ta, gia_tien, may_giat, ban_la, ti_vi, dieu_hoa, wifi, bep, do_xe, ho_boi, ban_ui, id_vi_tri
    } = body

    const existingRoom = await this.prisma.phong.findFirst({
      where: {
        ten_phong: ten_phong,
        vi_tri_Id: id_vi_tri,
        isDeleted: false
      }
    })
    if (existingRoom) {
      throw new BadRequestException("Tên phòng đã tồn tại trong vị trí này")
    }
    if (file && !file.mimetype.startsWith('image/')) {
      throw new BadRequestException("File phải là hình ảnh")
    }
    const hinhAnh = file ? await uploadImageToCloudinary(file) : undefined;

    const newRoom = await this.prisma.phong.create({
      data: {
        ten_phong: ten_phong,
        khach: khach,
        phong_ngu: phong_ngu,
        giuong: giuong,
        phong_tam: phong_tam,
        mo_ta: mo_ta,
        gia_tien: gia_tien,
        may_giat: may_giat,
        ban_la: ban_la,
        ti_vi: ti_vi,
        dieu_hoa: dieu_hoa,
        wifi: wifi,
        bep: bep,
        do_xe: do_xe,
        ho_boi: ho_boi,
        ban_ui: ban_ui,
        hinh_anh: hinhAnh,
        vi_tri_Id: id_vi_tri
      }
    })
    return newRoom;
  }


  async findAllRooms(query: QueryRoomDto) {
    const { skip, page, pageSize, where, hasPagination, take } =
      buildQueryPrismaRoom(query);

    const queryOptions: any = {
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        ViTri: true,
        BinhLuan: true,
        DatPhong: true,
      },
    };

    // 📄 Pagination
    if (hasPagination) {
      queryOptions.skip = skip;
      queryOptions.take = take;
    }

    // ⚡ chạy song song
    const [items, totalItem] = await Promise.all([
      this.prisma.phong.findMany(queryOptions),
      this.prisma.phong.count({ where }),
    ]);

    const totalPage = hasPagination
      ? Math.ceil(totalItem / pageSize)
      : 1;

    return {
      message: 'Lấy danh sách phòng thành công',
      totalItem,
      totalPage,
      page: hasPagination ? page : 1,
      pageSize: hasPagination ? pageSize : totalItem,
      items,
    };
  }


  async findRoomsByLocationId(id_vi_tri: number) {
    const location = await this.prisma.viTri.findFirst({
      where: {
        id: id_vi_tri,
        isDeleted: false,
      },
    });

    if (!location) {
      throw new BadRequestException('Không tìm thấy vị trí');
    }

    const items = await this.prisma.phong.findMany({
      where: {
        vi_tri_Id: id_vi_tri,
        isDeleted: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        ViTri: true,
        BinhLuan: true,
        DatPhong: true,
      },
    });

    return {
      message: 'Lấy danh sách phòng theo vị trí thành công',
      totalItem: items.length,
      items,
    };
  }

  async findRoomsByName(query: QueryRoomDto) {
    const roomName = query.ten_phong?.trim();

    if (!roomName) {
      throw new BadRequestException('Vui lòng nhập ten_phong để tìm kiếm');
    }

    let page = Number(query.page ?? 1);
    let pageSize = Number(query.pageSize ?? 5);

    if (!Number.isFinite(page) || page < 1) page = 1;
    if (!Number.isFinite(pageSize) || pageSize < 1) pageSize = 5;

    const hasPagination =
      query.page !== undefined || query.pageSize !== undefined;

    const skip = (page - 1) * pageSize;
    const where = {
      isDeleted: false,
      ten_phong: {
        contains: roomName,
      },
    };

    const queryOptions: any = {
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        ViTri: true,
        BinhLuan: true,
        DatPhong: true,
      },
    };

    if (hasPagination) {
      queryOptions.skip = skip;
      queryOptions.take = pageSize;
    }

    const [items, totalItem] = await Promise.all([
      this.prisma.phong.findMany(queryOptions),
      this.prisma.phong.count({ where }),
    ]);

    const totalPage = hasPagination ? Math.ceil(totalItem / pageSize) : 1;

    return {
      message: 'Lấy danh sách phòng theo tên thành công',
      totalItem,
      totalPage,
      page: hasPagination ? page : 1,
      pageSize: hasPagination ? pageSize : totalItem,
      items,
    };
  }

  async findRoomsById(id: number) {
    const existingRoom = await this.prisma.phong.findFirst({
      where: {
        id: id,
        isDeleted: false,
      },
      include: {
        DatPhong: true,
        BinhLuan: true
      }
    })
    if (!existingRoom) {
      throw new BadRequestException('không tìm thấy phòng')
    }
    return {
      message: "lấy chi tiết phòng thành công",
      item: existingRoom
    }
  }

  async updateRooms(
    body: UpdateRoomDto,
    id: number,
    file?: Express.Multer.File
  ) {
    const existingRoom = await this.prisma.phong.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!existingRoom) {
      throw new BadRequestException('không tìm thấy phòng');
    }

    if (file && !file.mimetype.startsWith('image/')) {
      throw new BadRequestException('File phải là hình ảnh');
    }

    // 👉 merge dữ liệu mới + cũ (chỉ lấy field được gửi lên)
    const nextData = {
      ...existingRoom,
      ...Object.fromEntries(
        Object.entries({
          ten_phong: body.ten_phong,
          vi_tri_Id: body.id_vi_tri,
          khach: body.khach,
          phong_ngu: body.phong_ngu,
          giuong: body.giuong,
          phong_tam: body.phong_tam,
          mo_ta: body.mo_ta,
          gia_tien: body.gia_tien,
          may_giat: body.may_giat,
          ban_la: body.ban_la,
          ti_vi: body.ti_vi,
          dieu_hoa: body.dieu_hoa,
          wifi: body.wifi,
          bep: body.bep,
          do_xe: body.do_xe,
          ho_boi: body.ho_boi,
          ban_ui: body.ban_ui,
        }).filter(([_, value]) => value !== undefined)
      ),
    };

    // 👉 check duplicate
    const duplicateRoom = await this.prisma.phong.findFirst({
      where: {
        ten_phong: nextData.ten_phong,
        vi_tri_Id: nextData.vi_tri_Id,
        isDeleted: false,
        id: { not: id },
      },
    });

    if (duplicateRoom) {
      throw new BadRequestException('Tên phòng đã tồn tại trong vị trí này');
    }

    const oldImageUrl = existingRoom.hinh_anh;
    const hinhAnh = file ? await uploadImageToCloudinary(file) : undefined;

    // 👉 update
    const updatedRoom = await this.prisma.phong.update({
      where: { id },
      data: {
        ...nextData,
        ...(hinhAnh && { hinh_anh: hinhAnh }),
      },
    });

    if (hinhAnh && oldImageUrl && oldImageUrl !== hinhAnh) {
      try {
        await deleteImageFromCloudinary(oldImageUrl);
      } catch (error) {
        console.error('xóa ảnh phòng cũ thất bại', error);
      }
    }

    return {
      message: 'Cập nhật phòng thành công',
      item: updatedRoom,
    };
  }

  async deleteRooms(id: number) {
    const existingRoom = await this.prisma.phong.findFirst({
      where: {
        id: id,
      }
    })
    if (!existingRoom) {
      throw new BadRequestException("không tìm thấy id phòng ")
    }
    const imageUrl = existingRoom.hinh_anh;
    const deleteRoom = await this.prisma.phong.delete({
      where: {
        id: id,
      }
    })
    if (imageUrl) {
      try {
        await deleteImageFromCloudinary(imageUrl);
      } catch (error) {
        console.error('xóa ảnh phòng thất bại', error);
      }
    }
    return {
      message: "xóa phòng thành công",
      item: deleteRoom,
    }
  }

  async uploadImageRoom(id: number, file: Express.Multer.File) {

    if (!file) {
      throw new BadRequestException('Vui lòng chọn file');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('File phải là hình ảnh');
    }

    const room = await this.prisma.phong.findFirst({
      where: {
        id: id,
        isDeleted: false,
      },
    });

    if (!room) {
      throw new BadRequestException('phòng không tồn tại');
    }
    const oldImageUrl = room.hinh_anh;

    const hinhAnh = await uploadImageToCloudinary(file);

    if (hinhAnh && oldImageUrl && oldImageUrl !== hinhAnh) {
      try {
        await deleteImageFromCloudinary(oldImageUrl);
      } catch (error) {
        console.error('xóa ảnh phòng cũ thất bại', error);
      }
    }

    return this.prisma.phong.update({
      where: { id },
      data: {
        ...(hinhAnh && { hinh_anh: hinhAnh }),
      },
    });

  }
}
