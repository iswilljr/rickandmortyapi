import { Injectable } from "@nestjs/common";
import { CharacterService } from "character/character.service";
import { EpisodeService } from "episode/episode.service";
import { LocationService } from "location/location.service";
import { CreateCharacterDto } from "seed/interfaces/create-character.inteface";
import type { CharacterResponse, EpisodeResponse, LocationResponse } from "common/interfaces";
import type { PaginationResponse } from "./interfaces/response.interface";

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
    await this.episodeService.create(episodesToInsert);
  }

  private async seedLocations(): Promise<void> {
    const locations = await this.getData<LocationResponse>("/location");
    const locationsToInsert = locations.map(({ residents, ...location }) => location);
    await this.locationService.create(locationsToInsert);
  }

  private async seedCharacters(): Promise<void> {
    const characters = await this.getData<CharacterResponse>("/character");
    const charactersToInsert: CreateCharacterDto[] = characters.map(({ location, origin, episode, ...character }) => {
      return {
        ...character,
        episode: episode.map(this.getIdFromURL),
        originId: this.getIdFromURL(origin.url),
        locationId: this.getIdFromURL(location.url),
      };
    });
    await this.characterService.createCharacters(charactersToInsert);
  }

  private async preSeed(): Promise<void> {
    await Promise.all([
      this.characterService.removeAll(),
      this.episodeService.removeAll(),
      this.locationService.removeAll(),
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
