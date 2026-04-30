import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TelegramLogInterceptor } from './interceptors/telegram-log.interceptor';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';

@Module({
  controllers: [TelegramController],
  providers: [
    TelegramService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TelegramLogInterceptor,
    },
  ],
})
export class TelegramModule {}
