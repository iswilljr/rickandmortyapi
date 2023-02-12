import { Injectable } from "@nestjs/common";
import { CharacterService } from "../character/character.service";
import { EpisodeService } from "../episode/episode.service";
import { LocationService } from "../location/location.service";
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

  async seed(): Promise<string> {
    await this.preSeed();

    await Promise.all([this.seedEpisodes(), this.seedLocations()]);

    // depends on episodes and locations
    await this.seedCharacters();

    return "SEED EXECUTED";
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
          episode: episode.map(this.getIdFromURL),
          originId: this.getIdFromURL(origin.url),
          locationId: this.getIdFromURL(location.url),
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

  private async getData<T>(url: string): Promise<T[]> {
    const res = await fetch(this.getPath(url));
    const data: PaginationResponse<T> = await res.json();

    return data.results.concat(data.info.next ? await this.getData<T>(data.info.next) : []);
  }

  private getPath(url: string): string {
    return `${this.baseURL}${url.replace(this.baseURL, "")}`;
  }

  private getIdFromURL(url: string): number {
    return Number(url.split("/").pop());
  }
}
