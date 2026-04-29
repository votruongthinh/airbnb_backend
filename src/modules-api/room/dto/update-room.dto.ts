
import { PartialType } from '@nestjs/mapped-types';
import { RoomDto } from './room.dto';

export class UpdateRoomDto extends PartialType(RoomDto) {}
