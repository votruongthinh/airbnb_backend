import { IsNotEmpty, IsString } from 'class-validator';

export class LocationDto {
  @IsString()
  @IsNotEmpty()
  ten_vi_tri!: string;

  @IsString()
  @IsNotEmpty()
  tinh_thanh!: string;

  @IsString()
  @IsNotEmpty()
  quoc_gia!: string;
}
