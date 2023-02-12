import { NestFactory } from "@nestjs/core";
import { Logger, ValidationPipe } from "@nestjs/common";
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

  await app.listen(+(process.env.PORT as string) || 4000);

  logger.log(`App running on ${await app.getUrl()}`);
}

bootstrap().catch((err) => {
  logger.error(err);
  process.exit(1);
});
