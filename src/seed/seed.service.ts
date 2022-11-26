import { Injectable, Logger } from "@nestjs/common";
import { CharacterService } from "character/character.service";
import { EpisodeService } from "episode/episode.service";
import { LocationService } from "location/location.service";
import type { CharacterResponse, EpisodeResponse, LocationResponse } from "common/interfaces";
import type { PaginationResponse } from "./interfaces/response.interface";
import { CreateCharacterDto } from "character/dto/create-character.dto";

@Injectable()
export class SeedService {
  private readonly logger = new Logger("SeedService");
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

    return "This action adds a new seed";
  }

  private async seedEpisodes(): Promise<void> {
    try {
      const episodes = await this.getData<EpisodeResponse>("/episode");
      const episodesToInsert = episodes.map(({ characters, ...episode }) => episode);
      await this.episodeService.create(episodesToInsert);
    } catch (error) {
      this.handleError(error, "SeedEpisodes");
    }
  }

  private async seedLocations(): Promise<void> {
    try {
      const locations = await this.getData<LocationResponse>("/location");
      const locationsToInsert = locations.map(({ residents, ...location }) => location);
      await this.locationService.create(locationsToInsert);
    } catch (error) {
      this.handleError(error, "SeedLocations");
    }
  }

  private async seedCharacters(): Promise<void> {
    try {
      const characters = await this.getData<CharacterResponse>("/character");
      console.log("seedCharacters", characters.length);
      const charactersToInsert: CreateCharacterDto[] = characters.map((character) => {
        return {
          ...character,
          episode: character.episode.map(this.getIdFromURL),
          originId: this.getIdFromURL(character.origin.url),
          locationId: this.getIdFromURL(character.location.url),
        };
      });
      console.log("charactersToInsert", charactersToInsert.length);
      await this.characterService.createCharacters(charactersToInsert);
    } catch (error) {
      this.handleError(error, "SeedCharacters");
    }
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

  private handleError(error: any, name: string): void {
    this.logger.error(`${name}: ${error?.message as string}`);
  }
}
