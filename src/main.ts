import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));
  app.use(cookieParser(process.env.JWT_SECRET));

  app.setGlobalPrefix('api')
  app.enableCors();
  await app.listen(8080);
}
bootstrap();
