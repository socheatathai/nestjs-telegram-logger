import { Injectable, Logger } from '@nestjs/common';
import type {
  TelegramApiResponse,
  TelegramChat,
  TelegramUpdate,
} from './types/telegram-api.types';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly token = process.env.TELEGRAM_BOT_TOKEN;
  private readonly chatId = process.env.TELEGRAM_CHAT_ID;

  async sendMessage(text: string): Promise<boolean> {
    if (!this.token || !this.chatId) {
      return false;
    }

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${this.token}/sendMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: this.chatId,
            text,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
          }),
        },
      );

      if (!response.ok) {
        const body = await response.text();
        this.logger.warn(`Telegram send failed: ${response.status} ${body}`);
        return false;
      }

      return true;
    } catch (error) {
      this.logger.warn(
        `Telegram send failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return false;
    }
  }

  async sendTestMessage(message?: string): Promise<{ sent: boolean }> {
    const sent = await this.sendMessage(
      message || 'Telegram logging is connected.',
    );

    return { sent };
  }

  async getChatsFromUpdates(): Promise<TelegramChat[]> {
    const data = await this.request<TelegramUpdate[]>('getUpdates');
    const chats = (data.result ?? [])
      .map((update) => update.message?.chat ?? update.my_chat_member?.chat)
      .filter((chat): chat is TelegramChat => Boolean(chat));

    return Array.from(new Map(chats.map((chat) => [chat.id, chat])).values());
  }

  private async request<T>(method: string): Promise<TelegramApiResponse<T>> {
    if (!this.token) {
      throw new Error('TELEGRAM_BOT_TOKEN is not configured');
    }

    const response = await fetch(
      `https://api.telegram.org/bot${this.token}/${method}`,
    );
    const data = (await response.json()) as TelegramApiResponse<T>;

    if (!response.ok || !data.ok) {
      throw new Error(
        data.description ?? `Telegram API request failed: ${response.status}`,
      );
    }

    return data;
  }
}
