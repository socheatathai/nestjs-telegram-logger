import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class TestTelegramMessageDto {
  @ApiPropertyOptional({
    example: 'Telegram logging is connected.',
  })
  @IsOptional()
  @IsString()
  message?: string;
}
