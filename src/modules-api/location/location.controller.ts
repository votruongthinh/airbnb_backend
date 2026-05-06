import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LocationService } from './location.service';
import { LocationDto } from './dto/location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { QueryLocationDto } from './dto/query-location.dto';
import { multerImageOptions } from 'src/common/multer/cloud.config';
//import { User } from 'src/common/decorator/user.decorator';
import { Roles } from 'src/common/decorator/role.decorator';

@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @Roles(1)
  @UseInterceptors(FileInterceptor('hinh_anh', multerImageOptions))
  createLocation(
    @Body() body: LocationDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const result = this.locationService.createLocation(body, file);
    return result;
  }

  @Get()
  findAllLocation(@Query() query: QueryLocationDto) {
    const result = this.locationService.findAllLocation(query);
    return result;
  }

  @Get(':id')
  findByIdLocation(@Param('id', ParseIntPipe) id: number) {
    const result = this.locationService.findByIdLocation(id);
    return result;
  }

  @Patch(':id')
  @Roles(1)
  @UseInterceptors(FileInterceptor('hinh_anh', multerImageOptions))
  updateLocation(
    @Body() body: UpdateLocationDto,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const result = this.locationService.updateLocation(body, id, file);
    return result;
  }

  @Post('upload-img/:id')
  @Roles(1)
  @UseInterceptors(FileInterceptor('file', multerImageOptions))
  uploadImageLocation(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const result = this.locationService.uploadImageLocation(id, file);
    return result;
  }

  @Delete(':id')
  @Roles(1)
  deleteLocation(@Param('id', ParseIntPipe) id: number) {
    const result = this.locationService.deleteLocation(id);
    return result;
  }
}
