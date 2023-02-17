import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { type FindManyOptions, Repository } from "typeorm";
import { CRUDService } from "../common/classes/crud.service";
import { Character } from "./entities/character.entity";
import { transformCharacter } from "./helpers/transform-character.helper";
import type { CharacterResponse } from "../common/interfaces/character.interface";
import type { PaginationResponse } from "../common/interfaces";
import type { CharacterQueryDto } from "./dto/character-query.dto";

@Injectable()
export class CharacterService {
  private readonly characterOptions: FindManyOptions<Character> = {
    relations: {
      episode: true,
      origin: true,
      location: true,
    },
    select: {
      episode: { id: true, uuid: true },
      origin: { id: true, name: true },
      location: { id: true, name: true },
    },
  };

  readonly crud: CRUDService<Character, CharacterResponse>;

  constructor(@InjectRepository(Character) characterRepository: Repository<Character>) {
    this.crud = new CRUDService(characterRepository, {
      loggerName: "CharacterService",
      transformObj: transformCharacter,
      endpoint: "character",
    });
  }

  findOneOrMany(id: number[]): Promise<CharacterResponse | CharacterResponse[]> {
    return this.crud.findOneOrMany(id, this.characterOptions);
  }

  findAll(query: CharacterQueryDto): Promise<PaginationResponse<CharacterResponse>> {
    return this.crud.findAll({ query, options: this.characterOptions });
  }
}
