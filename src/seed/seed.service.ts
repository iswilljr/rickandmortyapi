import { Injectable } from "@nestjs/common";
import { CharacterService } from "character/character.service";
import { EpisodeService } from "episode/episode.service";
import { LocationService } from "location/location.service";

@Injectable()
export class SeedService {
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

  async seedEpisodes(): Promise<void> {}

  async seedLocations(): Promise<void> {}

  async seedCharacters(): Promise<void> {}

  private async preSeed(): Promise<void> {
    await Promise.all([
      this.characterService.removeAll(),
      this.episodeService.removeAll(),
      this.locationService.removeAll(),
    ]);
  }
}
