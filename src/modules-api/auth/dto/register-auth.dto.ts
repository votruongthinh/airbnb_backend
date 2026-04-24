import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';
export class registerDTO {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  pass_word!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsDate()
  @Type(() => Date)
  birth_day!: Date;

  @IsBoolean()
  @IsNotEmpty()
  gender!: boolean;
}
