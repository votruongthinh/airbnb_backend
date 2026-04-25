import {
  Injectable,
  Body,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { registerDTO } from './dto/register-auth.dto';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import bcrypt from 'bcrypt';
import { LoginDto } from './dto/login-auth.dto';
import { TokenService } from 'src/modules-system/token/token.service';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
  ) {}
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
  async login(body: LoginDto) {
    const { email, pass_word } = body;

    const userExist = await this.prisma.nguoiDung.findUnique({
      where: {
        email: email,
      },
      omit: {
        pass_word: false,
      },
    });
    if (!userExist) {
      throw new BadRequestException(
        'tài khoản chưa tồn tại , vui lòng đăng kí',
      );
    }

    const isPassword = bcrypt.compareSync(pass_word, userExist.pass_word);

    if (!isPassword) {
      throw new BadRequestException(
        'mật khẩu không chính xác ,vui lòng thử lại',
      );
    }

    const accessToken = this.tokenService.createAccessToken(userExist.id);
    const refreshToken = this.tokenService.createRefreshToken(userExist.id);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
  async refreshToken(req: Request) {
    const { accessToken, refreshToken } = req.cookies;

    if (!accessToken) {
      throw new UnauthorizedException('không có accesstoken để kiểm tra');
    }
    if (!refreshToken) {
      throw new UnauthorizedException('Không có refreshtoken để kiểm tra');
    }

    const decodeAccessToken: any = this.tokenService.verifyAccessToken(
      accessToken,
      { ignoreExpiration: true },
    );

    const decodeRefreshToken: any =
      this.tokenService.verifyRefreshToken(refreshToken);

    if (decodeAccessToken.userId !== decodeRefreshToken.userId) {
      throw new UnauthorizedException('Token không hợp lệ');
    }

    const userExist = await this.prisma.nguoiDung.findUnique({
      where: {
        id: decodeAccessToken.userId,
      },
    });
    if (!userExist) {
      throw new UnauthorizedException('không tìm thấy user trong db');
    }
    const accessTokenNew = this.tokenService.createAccessToken(userExist.id);
    const refreshTokenNew = this.tokenService.createRefreshToken(userExist.id);

    return {
      accessToken: accessTokenNew,
      refreshToken: refreshTokenNew,
    };
  }
}
