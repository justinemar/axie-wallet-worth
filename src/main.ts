import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication >(AppModule);
  app.enableCors();
  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  const port = configService.get('PORT');
  await app.listen(port || 3000);
}
bootstrap();
