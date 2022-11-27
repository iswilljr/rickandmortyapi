import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { EpisodeService } from "./episode.service";
import { EpisodeResponse } from "common/interfaces/episode.interface";

@Controller("episode")
export class EpisodeController {
  constructor(private readonly episodeService: EpisodeService) {}

  @Get()
  findAll(): Promise<EpisodeResponse[]> {
    return this.episodeService.findAll({ relations: { characters: true } });
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): Promise<EpisodeResponse> {
    return this.episodeService.findOneBy({ id });
  }
}
