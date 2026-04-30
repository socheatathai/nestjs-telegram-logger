import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsInt, IsString, Min } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  mail: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 25, minimum: 0 })
  @IsInt()
  @Min(0)
  age: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  isActive: boolean;
}
