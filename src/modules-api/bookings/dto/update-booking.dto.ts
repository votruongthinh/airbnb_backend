import { PartialType } from '@nestjs/swagger';
import { BookingBodyDto } from './bookingBody.dto';

export class UpdateBookingDto extends PartialType(BookingBodyDto) { }
