import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

const logger = new Logger("App");

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  app.setGlobalPrefix("api");

  await app.listen(+process.env.PORT || 4000);

  logger.log(`App running on ${await app.getUrl()}`);
}

bootstrap().catch((err) => {
  logger.error(err);
  process.exit(1);
});
