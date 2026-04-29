import {
    IsOptional,
    IsString,
    IsNumber,
    IsBoolean,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class QueryRoomDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    pageSize?: number;


    @IsOptional()
    @IsString()
    ten_phong?: string;


    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    minPrice?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    maxPrice?: number;


    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    khach?: number;


    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    phong_ngu?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    phong_tam?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    giuong?: number;


    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    id_vi_tri?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    vi_tri_Id?: number;


    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    may_giat?: boolean;

    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    ban_la?: boolean;

    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    ti_vi?: boolean;

    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    dieu_hoa?: boolean;

    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    wifi?: boolean;

    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    bep?: boolean;

    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    do_xe?: boolean;

    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    ho_boi?: boolean;

    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    ban_ui?: boolean;
}
