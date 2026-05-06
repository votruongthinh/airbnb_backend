import { BadRequestException, Injectable } from '@nestjs/common';
import { BookingBodyDto } from './dto/bookingBody.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async createBooking(body: BookingBodyDto, userId: number) {
    const { ma_phong, ngay_den, ngay_di, so_luong_khach } = body
    const checkIn = new Date(ngay_den)
    const checkOut = new Date(ngay_di)

    if (checkIn >= checkOut) {
      throw new BadRequestException("Ngày đi phải lớn hơn ngày đến")
    }
    const isBooked = await this.prisma.datPhong.findFirst({
      where: {
        ma_phong,
        isDeleted: false,
        AND: [
          { ngay_den: { lt: checkOut } },
          { ngay_di: { gt: checkIn } }
        ]
      }
    })
    if (isBooked) {
      throw new BadRequestException('Phòng đã được đặt trong khoảng thời gian này')

    }
    return this.prisma.datPhong.create({
      data: {
        ma_phong,
        ngay_den: checkIn,
        ngay_di: checkOut,
        so_luong_khach,
        ma_nguoi_dat: userId,
      }

    })

  }

  async findAllBookings() {
    const findAll = await this.prisma.datPhong.findMany({
      orderBy: {
        id: 'desc'
      },
      include: {
        Phong: true
      }
    })
    return findAll;
  }

  findOneBookings(id: number) {
    return `This action returns a #${id} booking`;
  }

  update(id: number, body: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
