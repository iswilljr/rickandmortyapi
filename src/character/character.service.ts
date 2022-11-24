import { Injectable } from "@nestjs/common";
import { CreateCharacterDto } from "./dto/create-character.dto";
import { UpdateCharacterDto } from "./dto/update-character.dto";

@Injectable()
export class CharacterService {
  create(createCharacterDto: CreateCharacterDto): string {
    return "This action adds a new character";
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
