import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Episode } from "./entities/episode.entity";
import { EpisodeController } from "./episode.controller";
import { EpisodeService } from "./episode.service";

@Module({
  imports: [TypeOrmModule.forFeature([Episode])],
  controllers: [EpisodeController],
  providers: [EpisodeService, ConfigService],
  exports: [TypeOrmModule, EpisodeService],
})
export class EpisodeModule {}
