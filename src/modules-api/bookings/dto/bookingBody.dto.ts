import { Type } from "class-transformer"
import { IsDateString, IsInt } from "class-validator"


export class BookingBodyDto {

    @Type(() => Number)
    @IsInt()
    ma_phong!: number

    @IsDateString()
    ngay_den!: string

    @IsDateString()
    ngay_di!: string

    @Type(() => Number)
    @IsInt()
    so_luong_khach!: number



}
