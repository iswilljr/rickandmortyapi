import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { Page } from "common/decorators/page.decorator";
import { EpisodeService } from "./episode.service";
import type { FindOptionsRelations } from "typeorm";
import type { EpisodeResponse } from "common/interfaces/episode.interface";
import type { PaginationResponse } from "common/interfaces";
import type { Episode } from "./entities/episode.entity";

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
