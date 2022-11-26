import { Controller, Get, Post, Body, Param, ParseIntPipe } from "@nestjs/common";
import { Auth } from "common/decorators/auth.decorator";
import { CharacterResponse } from "common/interfaces/character.interface";
import { CharacterService } from "./character.service";
import { CreateCharacterDto } from "./dto/create-character.dto";

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

  @Post()
  @Auth()
  create(@Body() createCharacterDto: CreateCharacterDto): Promise<CharacterResponse> {
    return this.characterService.createCharacter(createCharacterDto);
  }
}
