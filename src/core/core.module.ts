import { Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { RolesGuard } from './guard/roles.guard';
import { AccessTokenGuard } from 'src/modules/auth/guards/access-token.guard';

@Module({
  providers: [
    // 전역 인증 가드(선택)
    { provide: APP_GUARD, useClass: AccessTokenGuard },
    // RolesGuard는 전역으로 두지 말고 보통 필요한 라우트/컨트롤러에 붙이는 걸 추천
    // 필요하면 아래처럼 전역으로도 가능:
    // { provide: APP_GUARD, useClass: RolesGuard },
  ],
  exports: [],
})
export class CoreModule {}