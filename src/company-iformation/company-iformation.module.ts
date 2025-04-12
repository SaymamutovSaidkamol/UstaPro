import { Module } from '@nestjs/common';
import { CompanyIformationService } from './company-iformation.service';
import { CompanyIformationController } from './company-iformation.controller';

@Module({
  controllers: [CompanyIformationController],
  providers: [CompanyIformationService],
})
export class CompanyIformationModule {}
