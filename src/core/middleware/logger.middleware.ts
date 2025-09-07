import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware { // abstract과 implements의 차이는 무엇인가?
    private logger = new Logger('HTTP')

    use(req: Request, res: Response, next: NextFunction): void {
        const {ip, method, originalUrl} = req;
        const userAgent = req.get('user-agent') || '';
        const startTime = Date.now();

        // 요청 로깅
        this.logger.log(
            `📨 ${method} ${originalUrl} - ${ip} - ${userAgent}`
        );

        // 응답 완료 시 로깅
        res.on('finish', () => {
            const {statusCode} = res;
            const responseTime = Date.now() - startTime;

            const logLevel = statusCode >= 400 ? 'error' : 'log';
            const emoji = statusCode >= 400 ? '❌' : '✅';

            this.logger[logLevel](
                `${emoji} ${method} ${statusCode} ${originalUrl} - ${responseTime}ms - ${ip}`
            );
        });

        next();
    }
}