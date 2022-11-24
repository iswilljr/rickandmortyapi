import { Controller, Get, Post, Body, Param, ParseIntPipe } from "@nestjs/common";
import { Auth } from "common/decorators/auth.decorator";
import { CharacterService } from "./character.service";
import { CreateCharacterDto } from "./dto/create-character.dto";
import { Character } from "./entities/character.entity";

@Controller("character")
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Get()
  findAll(): Promise<Character[]> {
    return this.characterService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): Promise<Character> {
    return this.characterService.findOneBy({ id });
  }

  @Post()
  @Auth()
  create(@Body() createCharacterDto: CreateCharacterDto): Promise<Character> {
    return this.characterService.create(createCharacterDto);
  }
}
