import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CRUDService } from "common/classes/crud.service";
import { CharacterResponse } from "common/interfaces/character.interface";
import { Episode } from "episode/entities/episode.entity";
import { Location } from "location/entities/location.entity";
import { DeepPartial, In, Repository } from "typeorm";
import { CreateCharacterDto } from "./dto/create-character.dto";
import { Character } from "./entities/character.entity";
import { transformCharacter } from "./helpers/transform-character.helper";

@Injectable()
export class CharacterService extends CRUDService<Character, CharacterResponse> {
  constructor(
    @InjectRepository(Character) characterRepository: Repository<Character>,
    @InjectRepository(Episode) private readonly episodeRepository: Repository<Episode>,
    @InjectRepository(Location) private readonly locationRepository: Repository<Location>
  ) {
    super(characterRepository, { loggerName: "CharacterService", transformObj: transformCharacter });
  }

  async createCharacter(create: CreateCharacterDto): Promise<CharacterResponse> {
    const character = await this.getCharacter(create);

    // eslint-disable-next-line @typescript-eslint/return-await
    return this.create(character);
  }

  async createCharacters(create: CreateCharacterDto[]): Promise<CharacterResponse[]> {
    const characters = await Promise.all(create.map((character) => this.getCharacter(character)));

    // eslint-disable-next-line @typescript-eslint/return-await
    return this.create(characters) as unknown as Promise<CharacterResponse[]>;
  }

  private async getCharacter({
    episode,
    originId,
    locationId,
    ...createCharacterDto
  }: CreateCharacterDto): Promise<DeepPartial<Character>> {
    const [episodeObj, originAndlocation] = await Promise.all([
      this.episodeRepository.findBy({ id: In(episode) }),
      originId === locationId
        ? this.locationRepository.findOneBy({ id: originId })
        : this.locationRepository.findBy({ id: In([originId, locationId]) }),
    ]);

    const find = (id: number): Location => (originAndlocation as Location[]).find((value) => value.id === id);

    return {
      episode: episodeObj,
      location: Array.isArray(originAndlocation) ? find(locationId) : originAndlocation,
      origin: Array.isArray(originAndlocation) ? find(originId) : originAndlocation,
      ...createCharacterDto,
    };
  }
}
