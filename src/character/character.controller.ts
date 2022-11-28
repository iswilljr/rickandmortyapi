import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { CharacterDto } from "./dto/character.dto";
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
  findAll(@Query() { page = 1, ...filter }: CharacterDto): Promise<PaginationResponse<CharacterResponse>> {
    return this.characterService.findAll(page, filter, { relations: this.loadRelations });
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): Promise<CharacterResponse> {
    return this.characterService.findOneBy({ id }, { relations: this.loadRelations });
  }
}
