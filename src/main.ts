import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
  .setTitle('UstaPro Swagger')
  .setDescription('The UstaPro API description')
  .setVersion('1.0')
  .addSecurityRequirements('bearer', ['bearer'])
  .addBearerAuth()
  .build();
const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);
  await app.listen(process.env.PORT ?? 3001, );
}

console.log();


bootstrap();
