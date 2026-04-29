import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules-api/auth/auth.module';
import { PrismaModule } from './modules-system/prisma/prisma.module';
import { TokenModule } from './modules-system/token/token.module';
import { ProtectGuard } from './common/guard/protect.guard';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptor/logging.interceptor';
import { RolesGuard } from './common/guard/roles.guard';
import { ResponseSuccessInterceptor } from './common/interceptor/response-success.interceptor';
import { LocationModule } from './modules-api/location/location.module';
import { RoomModule } from './modules-api/room/room.module';

@Module({
  imports: [AuthModule, PrismaModule, TokenModule, LocationModule, RoomModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ProtectGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseSuccessInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
