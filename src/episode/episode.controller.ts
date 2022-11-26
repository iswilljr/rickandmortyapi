import { Controller, Get, Post, Body, Param, ParseIntPipe } from "@nestjs/common";
import { Auth } from "common/decorators/auth.decorator";
import { EpisodeService } from "./episode.service";
import { CreateEpisodeDto } from "./dto/create-episode.dto";
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

  @Post()
  @Auth()
  create(@Body() createEpisodeDto: CreateEpisodeDto): Promise<EpisodeResponse> {
    return this.episodeService.create(createEpisodeDto);
  }
}
