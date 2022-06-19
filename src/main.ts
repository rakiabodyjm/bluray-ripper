import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { readdirSync } from 'fs';

config({
  path:
    process.env.NODE_ENV === 'development'
      ? readdirSync(process.cwd()).includes('.env.development.local')
        ? '.env.development.local'
        : '.env.development.local'
      : readdirSync(process.cwd()).includes('.env.production.local')
      ? '.env.production.local'
      : '.env.production',
});
async function bootstrap() {
  // const app = await NestFactory.create(AppModule, {
  //   cors: {
  //     origin: '*',
  //   },
  // });
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT || 1001);
}
bootstrap();
