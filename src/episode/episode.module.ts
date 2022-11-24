import { Module } from "@nestjs/common";
import { EpisodeService } from "./episode.service";
import { EpisodeController } from "./episode.controller";
import { ConfigService } from "@nestjs/config";

@Module({
  controllers: [EpisodeController],
  providers: [EpisodeService, ConfigService],
})
export class EpisodeModule {}
