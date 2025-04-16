import { Module } from '@nestjs/common';
import { CantactService } from './cantact.service';
import { CantactController } from './cantact.controller';

@Module({
  controllers: [CantactController],
  providers: [CantactService],
})
export class CantactModule {}
