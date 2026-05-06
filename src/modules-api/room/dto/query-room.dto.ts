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


    // Public query param: `id_vi_tri`.
    // Still accepts legacy `vi_tri_Id` for backward compatibility.
    @IsOptional()
    @Transform(({ value, obj }) => {
        const raw = value ?? obj.vi_tri_Id;

        if (raw === undefined || raw === null || raw === '') {
            return undefined;
        }

        return Number(raw);
    })
    @IsNumber()
    id_vi_tri?: number;


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
