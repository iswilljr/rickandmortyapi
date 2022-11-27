import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { EpisodeService } from "./episode.service";
import { EpisodeResponse } from "common/interfaces/episode.interface";
import type { FindOptionsRelations } from "typeorm";
import type { Episode } from "./entities/episode.entity";
import { PaginationResponse } from "common/interfaces";
import { Page } from "common/decorators/page.decorator";

@Controller("episode")
export class EpisodeController {
  private readonly loadRelations: FindOptionsRelations<Episode> = { characters: true };

  constructor(private readonly episodeService: EpisodeService) {}

  @Get()
  findAll(@Page() page: number): Promise<PaginationResponse<EpisodeResponse>> {
    return this.episodeService.findAll(page, { relations: this.loadRelations });
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): Promise<EpisodeResponse> {
    return this.episodeService.findOneBy({ id }, { relations: this.loadRelations });
  }
}
