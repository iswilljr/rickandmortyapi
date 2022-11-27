import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { CharacterResponse } from "common/interfaces/character.interface";
import { CharacterService } from "./character.service";
import { Page } from "common/decorators/page.decorator";
import type { FindOptionsRelations } from "typeorm";
import type { Character } from "./entities/character.entity";
import type { PaginationResponse } from "common/interfaces/pagination.interface";

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
