import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module'; // UsersService를 export 하는 모듈
import { AccessTokenStrategy } from 'src/core/jwt/accessToken.strategy';
import { RefreshTokenStrategy } from 'src/core/jwt/refreshToken.strategy';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({}), // 비밀키/만료는 AuthService에서 ConfigService로 읽음
    UsersModule,            // ✅ UsersService 주입
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
