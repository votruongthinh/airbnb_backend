import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Transform, Type } from "class-transformer";

export class RoomDto {

    @IsString()
    @IsNotEmpty()
    ten_phong!: string;

    @Type(() => Number)
    @IsNumber()
    khach!: number;

    @Type(() => Number)
    @IsNumber()
    phong_ngu!: number;

    @Type(() => Number)
    @IsNumber()
    giuong!: number;

    @Type(() => Number)
    @IsNumber()
    phong_tam!: number;

    @IsString()
    @IsNotEmpty()
    mo_ta!: string;

    @Type(() => Number)
    @IsNumber()
    gia_tien!: number;

    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    may_giat!: boolean;

    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    ban_la!: boolean;

    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    ti_vi!: boolean;

    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    dieu_hoa!: boolean;

    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    wifi!: boolean;

    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    bep!: boolean;

    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    do_xe!: boolean;

    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    ho_boi!: boolean;

    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    ban_ui!: boolean;

    @Type(() => Number)
    @IsNumber()
    id_vi_tri!: number;
}