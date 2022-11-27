import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CharacterModule } from "./character/character.module";
import { CommonModule } from "./common/common.module";
import { EpisodeModule } from "./episode/episode.module";
import { LocationModule } from "./location/location.module";
import { SeedModule } from "./seed/seed.module";
import { validationSchema } from "./config/env.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env.local"],
      validationSchema,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      database: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_HOST,
      password: process.env.POSTGRES_PASSWORD,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      autoLoadEntities: true,
      synchronize: true,
    }),
    CommonModule,
    CharacterModule,
    EpisodeModule,
    LocationModule,
    SeedModule,
  ],
})
export class AppModule {}
