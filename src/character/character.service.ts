import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateCharacterDto } from "./dto/create-character.dto";
import { UpdateCharacterDto } from "./dto/update-character.dto";
import { Character } from "./entities/character.entity";

@Injectable()
export class CharacterService {
  constructor(@InjectRepository(Character) private readonly characterRepository: Repository<Character>) {}

  create(createCharacterDto: CreateCharacterDto): Promise<Character> {
    const character = this.characterRepository.create(createCharacterDto);

    return this.characterRepository.save(character);
  }

  findAll(): string {
    return `This action returns all character`;
  }

  findOne(id: number): string {
    return `This action returns a #${id} character`;
  }

  update(id: number, updateCharacterDto: UpdateCharacterDto): string {
    return `This action updates a #${id} character`;
  }

  remove(id: number): string {
    return `This action removes a #${id} character`;
  }
}
