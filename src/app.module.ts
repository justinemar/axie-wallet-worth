import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GraphQLModule } from '@nestjs/graphql';
import { AppService } from './app.service';
import { ClModule } from './api/cl/cl.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot(),
    ClModule
  ],
  providers: [AppService]
})
export class AppModule {}
