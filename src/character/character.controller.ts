import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { Page } from "common/decorators/page.decorator";
import { CharacterService } from "./character.service";
import type { FindOptionsRelations } from "typeorm";
import type { CharacterResponse } from "common/interfaces/character.interface";
import type { PaginationResponse } from "common/interfaces/pagination.interface";
import type { Character } from "./entities/character.entity";

@Controller("character")
export class CharacterController {
  private readonly loadRelations: FindOptionsRelations<Character> = { episode: true, origin: true, location: true };

  constructor(private readonly characterService: CharacterService) {}

  @Get()
  findAll(@Page() page: number): Promise<PaginationResponse<CharacterResponse>> {
    return this.characterService.findAll(page, { relations: this.loadRelations });
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): Promise<CharacterResponse> {
    return this.characterService.findOneBy({ id }, { relations: this.loadRelations });
  }
}
