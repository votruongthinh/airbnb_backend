import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenExpiredError } from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { TokenService } from 'src/modules-system/token/token.service';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';
import { AccessTokenPayload } from 'src/modules-system/token/dto/token-dto';

@Injectable()
export class ProtectGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private prisma: PrismaService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
      );
      console.log({ isPublic });
      if (isPublic) {
        return true;
      }

      const req = context.switchToHttp().getRequest();

      const { accessToken } = req.cookies;
      if (!accessToken) {
        throw new UnauthorizedException(`không có token`);
      }

      const decode: AccessTokenPayload =
        await this.tokenService.verifyAccessToken(accessToken);
      const userExist = await this.prisma.nguoiDung.findUnique({
        where: {
          id: decode.userId,
        },
      });
      if (!userExist) {
        throw new UnauthorizedException(`Người dùng không tồn tại`);
      }

      req.user = {
        userId: userExist.id,
        roleId: userExist.roleId,
      };

      console.log('ProtectGuard:', { decode, userExist });
      return true;
    } catch (error: any) {
      console.log({ error });
      switch (error.constructor) {
        case TokenExpiredError:
          throw new ForbiddenException(error.message);

        default:
          throw new UnauthorizedException();
      }
    }
  }
}
