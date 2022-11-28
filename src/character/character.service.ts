import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOptionsWhere, In, Repository } from "typeorm";
import { CRUDService } from "common/classes/crud.service";
import { Episode } from "episode/entities/episode.entity";
import { Location } from "location/entities/location.entity";
import { Character } from "./entities/character.entity";
import { transformCharacter } from "./helpers/transform-character.helper";
import type { CharacterResponse } from "common/interfaces/character.interface";
import type { CreateCharacterDto } from "../seed/interfaces/create-character.inteface";

@Injectable()
export class CharacterService extends CRUDService<Character, CharacterResponse> {
  constructor(
    @InjectRepository(Character) characterRepository: Repository<Character>,
    @InjectRepository(Episode) private readonly episodeRepository: Repository<Episode>,
    @InjectRepository(Location) private readonly locationRepository: Repository<Location>
  ) {
    super(characterRepository, {
      loggerName: "CharacterService",
      transformObj: transformCharacter,
      endpoint: "character",
    });
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
