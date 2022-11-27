import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EpisodeModule } from "episode/episode.module";
import { LocationModule } from "location/location.module";
import { CharacterModule } from "character/character.module";
import { SeedController } from "./seed.controller";
import { SeedService } from "./seed.service";

@Module({
  imports: [CharacterModule, EpisodeModule, LocationModule],
  controllers: [SeedController],
  providers: [SeedService, ConfigService],
})
export class SeedModule {}
