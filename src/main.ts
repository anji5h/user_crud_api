import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SeedService } from './modules/seed/seed.service';
import { ConsoleLogger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      colors: true,
    }),
  });

  const seederService = app.get(SeedService);
  await seederService.run();

  const config = new DocumentBuilder()
    .setTitle('USER CRUD API')
    .setDescription('USER CRUD API')
    .setVersion('1.0')
    .addTag('user')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
