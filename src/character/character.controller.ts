import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { CharacterQueryDto } from "./dto/character-query.dto";
import { CharacterService } from "./character.service";
import type { CharacterResponse } from "common/interfaces/character.interface";
import type { PaginationResponse } from "common/interfaces/pagination.interface";

@Controller("character")
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Get()
  findAll(@Query() query: CharacterQueryDto): Promise<PaginationResponse<CharacterResponse>> {
    return this.characterService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): Promise<CharacterResponse> {
    return this.characterService.findOne(id);
  }
}
