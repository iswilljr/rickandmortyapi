import { Controller, Get, Post, Body, Param, ParseIntPipe } from "@nestjs/common";
import { Auth } from "common/decorators/auth.decorator";
import { EpisodeService } from "./episode.service";
import { CreateEpisodeDto } from "./dto/create-episode.dto";
import { Episode } from "./entities/episode.entity";

@Controller("episode")
export class EpisodeController {
  constructor(private readonly episodeService: EpisodeService) {}

  @Get()
  findAll(): Promise<Episode[]> {
    return this.episodeService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): Promise<Episode> {
    return this.episodeService.findOneBy({ id });
  }

  @Post()
  @Auth()
  create(@Body() createEpisodeDto: CreateEpisodeDto): Promise<Episode> {
    return this.episodeService.create(createEpisodeDto);
  }
}
