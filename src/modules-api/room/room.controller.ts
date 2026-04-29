import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UploadedFiles, Query, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomDto } from './dto/room.dto';
//import { UpdateRoomDto } from './dto/update-room.dto';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { multerImageOptions } from 'src/common/multer/cloud.config';
import { Roles } from 'src/common/decorator/role.decorator';
import { QueryRoomDto } from './dto/query-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) { }

  @Post()
  @Roles(1)
  @UseInterceptors(FileInterceptor('hinh_anh', multerImageOptions))
  createRoom(
    @Body() body: RoomDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const result = this.roomService.createRoom(body, file);
    return result;
  }

  @Get()
  findAllRooms(@Query() query: QueryRoomDto) {
    const result = this.roomService.findAllRooms(query);
    return result
  }

  @Get('search')
  findRoomsByName(@Query() query: QueryRoomDto) {
    const result = this.roomService.findRoomsByName(query);
    return result;
  }

  @Get('location/:id_vi_tri')
  findRoomsByLocationId(@Param('id_vi_tri', ParseIntPipe) id_vi_tri: number) {
    const result = this.roomService.findRoomsByLocationId(id_vi_tri);
    return result;
  }

  @Get(':id')
  findRoomsById(@Param('id', ParseIntPipe) id: number) {
    const result = this.roomService.findRoomsById(id);
    return result;
  }

  @Patch(':id')
  @Roles(1)
  @UseInterceptors(AnyFilesInterceptor(multerImageOptions))
  updateRooms(
    @Body() body: UpdateRoomDto,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const file =
      files?.find((item) => item.fieldname === 'hinh_anh' || item.fieldname === 'file') ??
      files?.[0];
    const result = this.roomService.updateRooms(body, id, file)
    return result
  }


  @Delete(':id')
  @Roles(1)
  deleteRooms(@Param('id', ParseIntPipe) id: number) {
    const result = this.roomService.deleteRooms(id)
    return result;
  }

  @Post('upload-img-room/:id')
  @Roles(1)
  @UseInterceptors(FileInterceptor('file', multerImageOptions))
  uploadImageRoom(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const result = this.roomService.uploadImageRoom(id, file);
    return result;
  }
}
