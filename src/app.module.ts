import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      url: process.env.PROD_DB_URL,
      ssl: { rejectUnauthorized: process.env.NODE_ENV === 'production' ? true : false },
      autoLoadEntities: true,
    }), 
    AuthModule
  ],
})
export class AppModule {}
