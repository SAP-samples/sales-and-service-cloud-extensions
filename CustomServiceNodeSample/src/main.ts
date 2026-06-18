import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Register global exception filter for standardized error responses
  app.useGlobalFilters(new GlobalExceptionFilter());
  
  // Enable validation with transformation
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const port = process.env.PORT || 8080;
  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}
bootstrap();