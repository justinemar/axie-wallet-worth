import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GraphQLModule } from '@nestjs/graphql';
import { AppService } from './app.service';
import { ClModule } from './api/cl/cl.module';

@Module({
  controllers: [AppController],
  imports: [
    ClModule
  ],
  providers: [AppService]
})
export class AppModule {}
