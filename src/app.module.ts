import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
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
