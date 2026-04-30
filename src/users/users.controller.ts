import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TelegramLog } from '../telegram/decorators/telegram-log.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a user' })
  @Post()
  @TelegramLog()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @ApiOperation({ summary: 'List users' })
  @Get()
  @TelegramLog()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Get a user by id' })
  @Get(':id')
  @TelegramLog()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a user' })
  @Patch(':id')
  @TelegramLog()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete a user' })
  @Delete(':id')
  @TelegramLog()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
