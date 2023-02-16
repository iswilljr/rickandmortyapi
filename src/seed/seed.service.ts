import { Injectable } from "@nestjs/common";
import { CharacterService } from "../character/character.service";
import { EpisodeService } from "../episode/episode.service";
import { LocationService } from "../location/location.service";
import { getIdFromURL } from "../common/helpers/get-id-from-url";
import type { CharacterResponse, EpisodeResponse, LocationResponse, PaginationResponse } from "../common/interfaces";
import type { CreateCharacterDto } from "./interfaces/create-character.inteface";

@Injectable()
export class SeedService {
  private readonly baseURL = "https://rickandmortyapi.com/api";

  constructor(
    private readonly characterService: CharacterService,
    private readonly episodeService: EpisodeService,
    private readonly locationService: LocationService
  ) {}

  async seed(): Promise<Record<string, string>> {
    await this.preSeed();

    await Promise.all([this.seedEpisodes(), this.seedLocations()]);

    // depends on episodes and locations
    await this.seedCharacters();

    return { message: "OK" };
  }

  private async seedEpisodes(): Promise<void> {
    const episodes = await this.getData<EpisodeResponse>("/episode");
    const episodesToInsert = episodes.map(({ characters, ...episode }) => episode);
    await this.episodeService.crud.create(episodesToInsert);
  }

  private async seedLocations(): Promise<void> {
    const locations = await this.getData<LocationResponse>("/location");
    const locationsToInsert = locations.map(({ residents, ...location }) => location);
    await this.locationService.crud.create(locationsToInsert);
  }

  private async seedCharacters(): Promise<void> {
    const characters = await this.getData<CharacterResponse>("/character");
    const charactersToInsert: CreateCharacterDto[] = characters.map(
      ({ location, origin, episode, image, ...character }) => {
        return {
          ...character,
          image: image.split("/").pop() as string,
          episode: episode.map(getIdFromURL),
          originId: getIdFromURL(origin.url),
          locationId: getIdFromURL(location.url),
        };
      }
    );
    await this.characterService.createCharacters(charactersToInsert);
  }

  private async preSeed(): Promise<void> {
    await Promise.all([
      this.characterService.crud.removeAll(),
      this.episodeService.crud.removeAll(),
      this.locationService.crud.removeAll(),
    ]);
  }

  private async getData<T>(path: string): Promise<T[]> {
    const baseURL = `${this.baseURL}${path}`;

    const countRes = await fetch(baseURL);
    const countData: PaginationResponse<T> = await countRes.json();
    const { count } = countData.info;

    const ids = Array.from({ length: count }, (_, i) => i + 1);

    const res = await fetch(`${baseURL}/${ids.join(",")}`);
    const data: T[] = await res.json();

    return data;
  }
}
