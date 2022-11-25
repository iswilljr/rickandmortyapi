import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CRUDService } from "common/classes/crud.service";
import { CharacterResponse } from "common/interfaces/character.interface";
import { Repository } from "typeorm";
import { CreateCharacterDto } from "./dto/create-character.dto";
import { Character } from "./entities/character.entity";
import { transformCharacter } from "./helpers/transform-character.helper";

@Injectable()
export class CharacterService extends CRUDService<Character, CharacterResponse> {
  constructor(@InjectRepository(Character) characterRepository: Repository<Character>) {
    super(characterRepository, { loggerName: "CharacterService", transformObj: transformCharacter });
  }

  createCharacter({
    episode,
    locationId,
    originId,
    ...createCharacterDto
  }: CreateCharacterDto): Promise<CharacterResponse> {
    return this.create(createCharacterDto);
  }
}
