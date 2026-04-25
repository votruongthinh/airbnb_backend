import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-auth.dto';
import { registerDTO } from './dto/register-auth.dto';
import type { Request, Response } from 'express';
import { Public } from 'src/common/decorator/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //đăng kí người dùng
  @Post('register')
  @Public()
  async register(@Body() body: registerDTO) {
    const result = await this.authService.register(body);
    return result;
  }

  //đăng nhập người dùng
  @Post('login')
  @Public()
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(body);
    res.cookie('accessToken', result.accessToken);
    res.cookie('refreshToken', result.refreshToken);
    return true;
  }

  @Post('refresh-token')
  @Public()
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.refreshToken(req);
    res.cookie('accessToken', result.accessToken);
    res.cookie('refreshToken', result.refreshToken);
    return true;
  }
}
