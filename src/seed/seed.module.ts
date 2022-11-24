import { Module } from "@nestjs/common";
import { SeedService } from "./seed.service";
import { SeedController } from "./seed.controller";
import { ConfigService } from "@nestjs/config";
import { CharacterModule } from "character/character.module";
import { EpisodeModule } from "episode/episode.module";
import { LocationModule } from "location/location.module";

@Module({
  imports: [CharacterModule, EpisodeModule, LocationModule],
  controllers: [SeedController],
  providers: [SeedService, ConfigService],
})
export class SeedModule {}
