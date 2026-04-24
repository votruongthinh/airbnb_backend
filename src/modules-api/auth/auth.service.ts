import {
  Injectable,
  Body,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { registerDTO } from './dto/register-auth.dto';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async register(body: registerDTO) {
    try {
      const { name, email, pass_word, phone, birth_day, gender } = body;

      const userExist = await this.prisma.nguoiDung.findUnique({
        where: {
          email: email,
        },
      });
      if (userExist) {
        throw new BadRequestException(
          'người dùng đã tồn tại, vui lòng đăng nhập',
        );
      }
      const passwordHash = bcrypt.hashSync(pass_word, 10);

      const userNew = await this.prisma.nguoiDung.create({
        data: {
          name: name,
          email: email,
          pass_word: passwordHash,
          phone: phone,
          birth_day: birth_day ? new Date(birth_day + 'T00:00:00.000Z') : null,
          gender: gender,
        },
      });
      console.log({ email, pass_word, userExist, userNew });
      return true;
    } catch (error) {
      console.error('❌ Register error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Lỗi đăng ký người dùng');
    }
  }
}
