import { Module } from '@nestjs/common';
import { ClService } from './cl.service';
import { ClController } from './cl.controller';
import { QueriesModule } from '@mavis/queries';

@Module({
  imports: [QueriesModule],
  controllers: [ClController],
  providers: [ClService]
})
export class ClModule {}
