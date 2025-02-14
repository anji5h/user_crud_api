import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SeedService } from './modules/seed/seed.service';
import { ConsoleLogger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { IJwtPayload } from './common/types/jwt-payload.type';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      colors: true,
    }),
  });

  const apiPath = '/api/v1';

  const seederService = app.get(SeedService);
  await seederService.run();

  const config = new DocumentBuilder()
    .setTitle('USER CRUD API')
    .setDescription('USER CRUD API')
    .setVersion('1.0')
    .addTag('user')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPath}/docs`, app, documentFactory);

  app.setGlobalPrefix(apiPath);

  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
