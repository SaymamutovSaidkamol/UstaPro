import { Module } from '@nestjs/common';
import { ProfessionLevelService } from './profession-level.service';
import { ProfessionLevelController } from './profession-level.controller';

@Module({
  controllers: [ProfessionLevelController],
  providers: [ProfessionLevelService],
})
export class ProfessionLevelModule {}
