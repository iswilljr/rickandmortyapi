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

    return "This action adds a new seed";
  }

  private async preSeed(): Promise<void> {
    await Promise.all([
      this.characterService.removeAll(),
      this.episodeService.removeAll(),
      this.locationService.removeAll(),
    ]);
  }
}
