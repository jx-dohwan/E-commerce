// src/common/filters/all-exceptions.filter.ts
import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  
  @Catch() // 모든 예외 잡기
  export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);
  
    // isProd는 main.ts에서 계산해서 전달받습니다.
    constructor(private readonly isProd: boolean) {}
  
    catch(exception: unknown, host: ArgumentsHost) {
    // HTTP 요청/응답 컨텍스트 가져오기
      const ctx = host.switchToHttp();
      const res = ctx.getResponse<Response>();
      const req = ctx.getRequest<Request>();
  
      const timestamp = new Date().toISOString(); // 예외 발생 시간
      const path = (req as any).originalUrl ?? req.url; // 요청 경로
  
      // 예외가 HttpException인지 여부에 따라 상태 코드 결정
      const status =
        exception instanceof HttpException
          ? exception.getStatus() // 예외에 내장된 상태 코드 사용(예: 400/401/403/404/409/500 등)
          : HttpStatus.INTERNAL_SERVER_ERROR; // 표준 내부 서버 오류 500으로 고정
  
      // HttpException의 getResponse가 문자열/객체/배열 섞여 들어올 수 있어 안전 처리
      const raw =
        exception instanceof HttpException
          ? (exception.getResponse() as any)
          : null;
  
      let baseMessage: string | string[] =
        (typeof raw === 'string' && raw) ||
        (raw?.message ?? (exception as any)?.message) ||
        'Internal server error';
  
      // 환경별 응답
      const clientMessage = this.isProd // 운영 환경이면 민감 정보 최소화
        ? status === 500
          ? 'Internal server error'
          : baseMessage
        : baseMessage;
  
      // 스택 로깅(개발자용)
      const stack = (exception as any)?.stack ?? String(exception); // 스택이 없으면 예외 자체를 문자열화
      this.logger.error(
        `[${req.method}] ${path} ${status} - ${timestamp}\n${stack}`,
      );
  
      res.status(status).json({
        statusCode: status,
        message: clientMessage,
        timestamp,
        path,
        ...(this.isProd
          ? {}
          : {
              error:
                exception instanceof HttpException ? exception.name : 'Error',
            }),
      });
    }
  }
  