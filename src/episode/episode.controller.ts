import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { EpisodeQueryDto } from "./dto/episode-query.dto";
import { EpisodeService } from "./episode.service";
import type { EpisodeResponse } from "common/interfaces/episode.interface";
import type { PaginationResponse } from "common/interfaces";

@Controller("episode")
export class EpisodeController {
  constructor(private readonly episodeService: EpisodeService) {}

  @Get()
  findAll(@Query() query: EpisodeQueryDto): Promise<PaginationResponse<EpisodeResponse>> {
    return this.episodeService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): Promise<EpisodeResponse> {
    return this.episodeService.findOne(id);
  }
}
