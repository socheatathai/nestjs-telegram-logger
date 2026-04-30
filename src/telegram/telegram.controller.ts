import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TestTelegramMessageDto } from './dto/test-telegram-message.dto';
import { TelegramService } from './telegram.service';

@ApiTags('telegram')
@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @ApiOperation({
    summary: 'List chats from Telegram updates to find TELEGRAM_CHAT_ID',
  })
  @Get('chats')
  getChats() {
    return this.telegramService.getChatsFromUpdates();
  }

  @ApiOperation({ summary: 'Send a test message to the configured chat' })
  @ApiBody({ type: TestTelegramMessageDto, required: false })
  @Post('test-message')
  sendTestMessage(@Body() dto: TestTelegramMessageDto = {}) {
    return this.telegramService.sendTestMessage(dto.message);
  }
}
