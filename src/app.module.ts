import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramModule } from './telegram/telegram.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      database: process.env.DB_NAME ?? 'db_bot',
      autoLoadEntities: true,
      synchronize: process.env.DB_SYNCHRONIZE !== 'false',
    }),
    TelegramModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
