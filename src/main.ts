import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

const logger = new Logger("App");

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");

  await app.listen(+process.env.PORT || 4000);

  logger.log(`App running on ${await app.getUrl()}`);
}

bootstrap().catch((err) => {
  logger.error(err);
  process.exit(1);
});
