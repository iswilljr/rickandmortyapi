import { resolve } from "path";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ServeStaticModule } from "@nestjs/serve-static";
import { CharacterModule } from "./character/character.module";
import { EpisodeModule } from "./episode/episode.module";
import { LocationModule } from "./location/location.module";
import { SeedModule } from "./seed/seed.module";
import { validationSchema } from "./config/env.config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, "images"),
      serveRoot: "/character/avatar",
    }),
    ConfigModule.forRoot({
      validationSchema,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      database: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_HOST,
      password: process.env.POSTGRES_PASSWORD,
      port: +(process.env.POSTGRES_PORT as string),
      username: process.env.POSTGRES_USER,
      autoLoadEntities: true,
      synchronize: true,
    }),
    CharacterModule,
    EpisodeModule,
    LocationModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
