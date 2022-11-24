import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CRUDService } from "common/classes/crud.service";
import { Repository } from "typeorm";
import { Character } from "./entities/character.entity";

@Injectable()
export class CharacterService extends CRUDService<Character> {
  constructor(@InjectRepository(Character) private readonly characterRepository: Repository<Character>) {
    super(characterRepository, "CharacterService");
  }
}
