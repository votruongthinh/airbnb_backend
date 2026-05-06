import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingBodyDto } from './dto/bookingBody.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { User } from 'src/common/decorator/user.decorator';

type AuthUser = {
  userId: number;
  roleId: number;
};

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }

  @Post()
  createBooking(@Body() body: BookingBodyDto, @User() user: AuthUser) {
    const result = this.bookingsService.createBooking(body, user.userId);
    return result;
  }

  @Get()
  findAllBookings(
  ) {
    const result = this.bookingsService.findAllBookings()
    return result
  }

  @Get(':id')
  findOneBookings(@Param('id', ParseIntPipe) id: number) {
    const result = this.bookingsService.findOneBookings(id);
    return result
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateBookingDto) {
    return this.bookingsService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(+id);
  }
}
