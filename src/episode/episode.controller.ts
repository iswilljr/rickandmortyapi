import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { Auth } from "common/decorators/auth.decorator";
import { EpisodeService } from "./episode.service";
import { CreateEpisodeDto } from "./dto/create-episode.dto";
import { UpdateEpisodeDto } from "./dto/update-episode.dto";

@Controller("episode")
export class EpisodeController {
  constructor(private readonly episodeService: EpisodeService) {}

  @Get()
  findAll(): string {
    return this.episodeService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string): string {
    return this.episodeService.findOne(+id);
  }

  @Post()
  @Auth()
  create(@Body() createEpisodeDto: CreateEpisodeDto): string {
    return this.episodeService.create(createEpisodeDto);
  }

  @Patch(":id")
  @Auth()
  update(@Param("id") id: string, @Body() updateEpisodeDto: UpdateEpisodeDto): string {
    return this.episodeService.update(+id, updateEpisodeDto);
  }

  @Delete(":id")
  @Auth()
  remove(@Param("id") id: string): string {
    return this.episodeService.remove(+id);
  }
}
