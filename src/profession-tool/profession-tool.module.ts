import { Module } from '@nestjs/common';
import { ProfessionToolService } from './profession-tool.service';
import { ProfessionToolController } from './profession-tool.controller';

@Module({
  controllers: [ProfessionToolController],
  providers: [ProfessionToolService],
})
export class ProfessionToolModule {}
