import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { CharacterResponse } from "common/interfaces/character.interface";
import { CharacterService } from "./character.service";

@Controller("character")
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Get()
  findAll(): Promise<CharacterResponse[]> {
    return this.characterService.findAll({ relations: { episode: true, origin: true, location: true } });
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): Promise<CharacterResponse> {
    return this.characterService.findOneBy({ id });
  }
}
