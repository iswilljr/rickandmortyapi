import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EpisodeModule } from "episode/episode.module";
import { LocationModule } from "location/location.module";
import { Character } from "./entities/character.entity";
import { CharacterController } from "./character.controller";
import { CharacterService } from "./character.service";

@Module({
  imports: [TypeOrmModule.forFeature([Character]), EpisodeModule, LocationModule],
  controllers: [CharacterController],
  providers: [CharacterService, ConfigService],
  exports: [TypeOrmModule, CharacterService],
})
export class CharacterModule {}
