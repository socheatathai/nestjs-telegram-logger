import { SetMetadata } from '@nestjs/common';

export const TELEGRAM_LOG_KEY = 'telegramLog';

export const TelegramLog = () => SetMetadata(TELEGRAM_LOG_KEY, true);
