import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? ['.env.production.local', '.env.production']
          : ['.env.development.local', '.env.development'],
      isGlobal: true,
    }),
    CacheModule.register({}),
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
