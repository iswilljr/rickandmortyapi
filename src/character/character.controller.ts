import { Controller, Get, Query } from "@nestjs/common";
import { Id } from "common/decorators/id.decorator";
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
  findOneOrMany(@Id() id: number[]): Promise<CharacterResponse | CharacterResponse[]> {
    return this.characterService.findOneOrMany(id);
  }
}
