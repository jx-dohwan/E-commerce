import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Res,
    UseGuards,
    Req, // ✅ 누락되었던 데코레이터 추가
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { RegisterDto, LoginDto } from './dto/auth.dto';
  import { AccessTokenGuard } from './guards/access-token.guard';
  import { RefreshTokenGuard } from './guards/refresh-token.guard';
  // ✅ decorator + isolatedModules 환경 대응: 타입 전용 import
  import type { Response, Request } from 'express';
  
  @Controller('auth')
  export class AuthController {
    constructor(private readonly auth: AuthService) {}
  
    private setRefreshCookie(res: Response, token: string) {
      res.cookie('refresh_token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/auth',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }
  
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(
      @Body() dto: RegisterDto,
      @Res({ passthrough: true }) res: Response,
    ) {
      const { accessToken, refreshToken } = await this.auth.register(
        dto.email,
        dto.password,
      );
      this.setRefreshCookie(res, refreshToken);
      return { accessToken };
    }
  
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(
      @Body() dto: LoginDto,
      @Res({ passthrough: true }) res: Response,
    ) {
      const { accessToken, refreshToken } = await this.auth.login(
        dto.email,
        dto.password,
      );
      this.setRefreshCookie(res, refreshToken);
      return { accessToken };
    }
  
    @UseGuards(RefreshTokenGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(
      @Req() req: Request,
      @Res({ passthrough: true }) res: Response,
    ) {
      const refreshToken = req.cookies?.['refresh_token'] ?? '';
      const payload: any = (req as any).user; // RefreshTokenStrategy.validate 반환
      const { accessToken, refreshToken: newRefresh } = await this.auth.refresh(
        payload.sub,
        refreshToken,
      );
      this.setRefreshCookie(res, newRefresh);
      return { accessToken };
    }
  
    @UseGuards(AccessTokenGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
      await this.auth.logout(req.user.sub);
      res.clearCookie('refresh_token', { path: '/auth' });
      return { ok: true };
    }
  }
  