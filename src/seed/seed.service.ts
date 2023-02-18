import { Injectable } from "@nestjs/common";
import { CharacterService } from "../character/character.service";
import { EpisodeService } from "../episode/episode.service";
import { LocationService } from "../location/location.service";
import { getIdFromURL } from "../common/helpers/get-id-from-url.helper";
import { existsSync, promises as fs } from "fs";
import * as path from "path";
import * as os from "os";
import type { CharacterResponse, EpisodeResponse, LocationResponse, PaginationResponse } from "../common/interfaces";
import type { DeepPartial } from "typeorm";
import type { Episode } from "episode/entities/episode.entity";
import type { Location } from "location/entities/location.entity";

@Injectable()
export class SeedService {
  private readonly baseURL = "https://rickandmortyapi.com/api";
  private locations: Record<number, DeepPartial<Location>>;
  private episodes: Record<number, DeepPartial<Episode>>;

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
    const episodes = await this.cache("episodes", () => this.getData<EpisodeResponse>("/episode"));
    const episodesToInsert = episodes.map(({ characters, ...episode }) => episode);

    const dbEpisodes = (await this.episodeService.crud.create(episodesToInsert)) as Array<DeepPartial<Episode>>;

    this.episodes = Object.fromEntries(dbEpisodes.map((episode) => [episode.id, episode]));
  }

  private async seedLocations(): Promise<void> {
    const locations = await this.cache("locations", () => this.getData<LocationResponse>("/location"));
    const locationsToInsert = locations.map(({ residents, ...location }) => location);

    const dbLocations = (await this.locationService.crud.create(locationsToInsert)) as Array<DeepPartial<Location>>;

    this.locations = Object.fromEntries(dbLocations.map((location) => [location.id, location]));
  }

  private async seedCharacters(): Promise<void> {
    const characters = await this.cache("characters", () => this.getData<CharacterResponse>("/character"));
    const charactersToInsert = characters.map(({ location, origin, episode, image, ...character }) => {
      const originId = getIdFromURL(origin.url);
      const locationId = getIdFromURL(location.url);

      return {
        ...character,
        image: image.split("/").pop() as string,
        episode: episode.map((episode) => this.episodes[getIdFromURL(episode)]),
        origin: originId ? this.locations[originId] : undefined,
        location: locationId ? this.locations[locationId] : undefined,
      };
    });

    await this.characterService.crud.create(charactersToInsert);
  }

  private async preSeed(): Promise<void> {
    await Promise.all([
      this.characterService.crud.removeAll(),
      this.episodeService.crud.removeAll(),
      this.locationService.crud.removeAll(),
    ]);
  }

  async getData<T>(path: string): Promise<T[]> {
    const baseURL = `${this.baseURL}${path}`;

    const countRes = await fetch(baseURL);
    const countData: PaginationResponse<T> = await countRes.json();
    const { count } = countData.info;

    const ids = Array.from({ length: count }, (_, i) => i + 1);

    const res = await fetch(`${baseURL}/${ids.join(",")}`);
    const data: T[] = await res.json();

    return data;
  }

  async cache<T>(key: string, fn: () => Promise<T>): Promise<T> {
    const dirname = path.resolve(os.tmpdir(), "rickandmortyapi");
    const filePath = path.resolve(dirname, `${key}.json`);

    const existsFile = existsSync(filePath);

    if (existsFile) {
      const content = await fs.readFile(filePath, "utf-8");
      const json = JSON.parse(content);

      return json;
    }

    const existsDirname = existsSync(dirname);
    if (!existsDirname) await fs.mkdir(dirname, { recursive: true });

    const result = await fn();
    await fs.writeFile(filePath, JSON.stringify(result), "utf-8");

    return result;
  }
}
