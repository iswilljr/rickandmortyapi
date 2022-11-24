import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { Auth } from "common/decorators/auth.decorator";
import { CharacterService } from "./character.service";
import { CreateCharacterDto } from "./dto/create-character.dto";
import { UpdateCharacterDto } from "./dto/update-character.dto";
import { Character } from "./entities/character.entity";

@Controller("character")
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Get()
  findAll(): string {
    return this.characterService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string): string {
    return this.characterService.findOne(+id);
  }

  @Post()
  @Auth()
  create(@Body() createCharacterDto: CreateCharacterDto): Promise<Character> {
    return this.characterService.create(createCharacterDto);
  }

  @Patch(":id")
  @Auth()
  update(@Param("id") id: string, @Body() updateCharacterDto: UpdateCharacterDto): string {
    return this.characterService.update(+id, updateCharacterDto);
  }

  @Delete(":id")
  @Auth()
  remove(@Param("id") id: string): string {
    return this.characterService.remove(+id);
  }
}
