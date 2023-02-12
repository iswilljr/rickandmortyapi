import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindManyOptions, FindOptionsWhere, In, Repository } from "typeorm";
import { CRUDService } from "../common/classes/crud.service";
import { Episode } from "../episode/entities/episode.entity";
import { Location } from "../location/entities/location.entity";
import { Character } from "./entities/character.entity";
import { transformCharacter } from "./helpers/transform-character.helper";
import type { CharacterResponse } from "../common/interfaces/character.interface";
import type { PaginationResponse } from "../common/interfaces";
import type { CreateCharacterDto } from "../seed/interfaces/create-character.inteface";
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

  constructor(
    @InjectRepository(Character) characterRepository: Repository<Character>,
    @InjectRepository(Episode) private readonly episodeRepository: Repository<Episode>,
    @InjectRepository(Location) private readonly locationRepository: Repository<Location>
  ) {
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

  async createCharacters(create: CreateCharacterDto[]): Promise<void> {
    const characters = await Promise.all(create.map((character) => this.getCharacter(character)));
    await this.crud.create(characters);
  }

  private async getCharacter({
    episode,
    originId,
    locationId,
    ...createCharacterDto
  }: CreateCharacterDto): Promise<DeepPartial<Character>> {
    const [episodeObj, originAndlocation] = await Promise.all([
      this.episodeRepository.findBy({ id: In(episode) }),
      locationId || originId
        ? this.locationRepository.findBy(
            ([] as Array<FindOptionsWhere<Location>>).concat(
              locationId ? [{ id: locationId }] : [],
              originId ? [{ id: originId }] : []
            )
          )
        : undefined,
    ]);

    const find = (id: number): Location | undefined => originAndlocation?.find((value) => value.id === id);

    const location = find(locationId);
    const origin = find(originId);

    return {
      ...createCharacterDto,
      episode: episodeObj,
      location: locationId && location ? location : undefined,
      origin: originId && origin ? origin : undefined,
    };
  }
}
