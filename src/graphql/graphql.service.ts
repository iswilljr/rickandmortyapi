import { Injectable } from "@nestjs/common";
import { CharacterService } from "../character/character.service";
import { EpisodeService } from "../episode/episode.service";
import { LocationService } from "../location/location.service";
import { characterOptions } from "../character/helpers/relations.helper";
import { locationOptions } from "../location/helpers/relations.helper";
import { episodeOptions } from "../episode/helpers/relations.helper";
import type { CharacterResponse, EpisodeResponse, LocationResponse, PaginationResponse } from "../common/interfaces";
import type {
  Characters,
  Episodes,
  FilterCharacter,
  FilterEpisode,
  FilterLocation,
  Info,
  Locations,
} from "./interfaces";

@Injectable()
export class GraphqlService {
  private readonly characterOptions = characterOptions;
  private readonly locationOptions = locationOptions;
  private readonly episodeOptions = episodeOptions;

  constructor(
    private readonly characterService: CharacterService,
    private readonly episodeService: EpisodeService,
    private readonly locationService: LocationService
  ) {}

  findOneOrManyCharacters(id: number | number[]): Promise<CharacterResponse | CharacterResponse[]> {
    return this.characterService.crud.findOneOrMany(Array.isArray(id) ? id : [id], this.characterOptions);
  }

  findOneOrManyLocations(id: number | number[]): Promise<LocationResponse | LocationResponse[]> {
    return this.locationService.crud.findOneOrMany(Array.isArray(id) ? id : [id], {
      relations: { residents: true },
      select: { residents: true },
    });
  }

  findOneOrManyEpisodes(id: number | number[]): Promise<EpisodeResponse | EpisodeResponse[]> {
    return this.episodeService.crud.findOneOrMany(Array.isArray(id) ? id : [id], this.episodeOptions);
  }

  async findAllCharacters(page?: number, query?: FilterCharacter): Promise<Characters> {
    const characters = await this.characterService.crud.findAll({
      query: { page, ...(query as any) },
      options: this.characterOptions,
    });

    return this.transformPaginationResponse(characters);
  }

  async findAllLocations(page?: number, query?: FilterLocation): Promise<Locations> {
    const locations = await this.locationService.crud.findAll({
      query: { page, ...(query as any) },
      options: this.locationOptions,
    });

    return this.transformPaginationResponse(locations);
  }

  async findAllEpisodes(page?: number, query?: FilterEpisode): Promise<Episodes> {
    const episodes = await this.episodeService.crud.findAll({
      query: { page, ...(query as any) },
      options: this.episodeOptions,
    });

    return this.transformPaginationResponse(episodes);
  }

  transformPaginationResponse<T>(response: PaginationResponse<T>): { results: T[]; info: Info } {
    const { next, prev } = response.info;

    const prevPage = prev ? +(new URL(prev).searchParams.get("page") as string) : null;
    const nextPage = next ? +(new URL(next).searchParams.get("page") as string) : null;

    return {
      results: response.results,
      info: {
        ...response.info,
        prev: prevPage,
        next: nextPage,
      },
    };
  }
}
