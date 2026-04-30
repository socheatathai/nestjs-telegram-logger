import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { catchError, tap, throwError } from 'rxjs';
import { TELEGRAM_LOG_KEY } from '../decorators/telegram-log.decorator';
import { TelegramService } from '../telegram.service';

@Injectable()
export class TelegramLogInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly telegramService: TelegramService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const shouldLog = this.reflector.getAllAndOverride<boolean>(
      TELEGRAM_LOG_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!shouldLog) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request>();
    const startedAt = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        this.sendRequestLog(request, response.statusCode, startedAt);
      }),
      catchError((error) => {
        const statusCode =
          error instanceof HttpException ? error.getStatus() : 500;
        this.sendRequestLog(request, statusCode, startedAt);
        return throwError(() => error);
      }),
    );
  }

  private sendRequestLog(
    request: Request,
    statusCode: number,
    startedAt: number,
  ): void {
    const durationMs = Date.now() - startedAt;
    const ip = request.ip || request.socket.remoteAddress || 'unknown';
    const userAgent = request.get('user-agent') || 'unknown';
    const message = [
      '<b>API Request</b>',
      `<b>Method:</b> ${request.method}`,
      `<b>Path:</b> ${this.escape(request.originalUrl || request.url)}`,
      `<b>Status:</b> ${statusCode}`,
      `<b>Duration:</b> ${durationMs}ms`,
      `<b>IP:</b> ${this.escape(ip)}`,
      `<b>User-Agent:</b> ${this.escape(userAgent)}`,
    ]
      .filter(Boolean)
      .join('\n');

    void this.telegramService.sendMessage(message);
  }

  private formatBody(body: unknown): string | undefined {
    if (!body || (typeof body === 'object' && Object.keys(body).length === 0)) {
      return undefined;
    }

    const text = JSON.stringify(body, null, 2);
    return this.escape(text.length > 1500 ? `${text.slice(0, 1500)}...` : text);
  }

  private escape(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}
