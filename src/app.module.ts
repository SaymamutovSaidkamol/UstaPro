import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { UploadModule } from './upload/upload.module';
import { MailModule } from './mail/mail.module';
// import { CommentsModule } from './comments/comments.module';
import { RegionsModule } from './regions/regions.module';
import { EskizService } from './eskiz/eskiz.service';
import { MasterModule } from './master/master.module';
import { ProfessionModule } from './profession/profession.module';
import { LevelModule } from './level/level.module';
import { BrandModule } from './brand/brand.module';
import { PowerModule } from './power/power.module';
import { SizeModule } from './size/size.module';
import { ToolModule } from './tool/tool.module';
import { BasketModule } from './basket/basket.module';
import { InfoModule } from './info/info.module';
import { CantactModule } from './Cantact/cantact.module';
import { FaqModule } from './faq/faq.module';
import { ShowcaseModule } from './showcase/showcase.module';
import { PartnersModule } from './partners/partners.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    UploadModule,
    MailModule,
    RegionsModule,
    MasterModule,
    ProfessionModule,
    LevelModule,
    BrandModule,
    PowerModule,
    SizeModule,
    ToolModule,
    BasketModule,
    InfoModule,
    CantactModule,
    FaqModule,
    ShowcaseModule,
    PartnersModule,
    OrderModule,
    
  ],
  controllers: [AppController],
  providers: [AppService, EskizService],
})
export class AppModule {}
