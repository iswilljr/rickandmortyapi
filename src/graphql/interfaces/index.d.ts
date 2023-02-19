/* eslint-disable @typescript-eslint/method-signature-style */
import type { CharacterResponse, EpisodeResponse, LocationResponse } from "../../common/interfaces";

export type Nullable<T> = T | null;
export type Required<T, R> = Omit<T, R> & { [P in R]: Exclude<T[P], undefined | null> };
export type PartialWith<T, R> = Required<Partial<T>, R>;

export interface Info {
  count: number;
  pages: number;
  next?: Nullable<number>;
  prev?: Nullable<number>;
}

export interface FilterCharacter {
  name?: Nullable<string>;
  status?: Nullable<string>;
  species?: Nullable<string>;
  type?: Nullable<string>;
  gender?: Nullable<string>;
}

export interface FilterLocation {
  name?: Nullable<string>;
  type?: Nullable<string>;
  dimension?: Nullable<string>;
}

export interface FilterEpisode {
  name?: Nullable<string>;
  episode?: Nullable<string>;
}

export interface Characters {
  info: Info;
  results: CharacterResponse[];
}

export interface Locations {
  info: Info;
  results: LocationResponse[];
}

export interface Episodes {
  info: Info;
  results: EpisodeResponse[];
}

export interface Definition {
  character(id: number): Promise<Nullable<CharacterResponse>>;

  characters(page?: Nullable<number>, filter?: Nullable<FilterCharacter>): Promise<Nullable<Characters>>;

  charactersByIds(ids: number[]): Promise<Nullable<CharacterResponse[]>>;

  location(id: number): Promise<Nullable<LocationResponse>>;

  locations(page?: Nullable<number>, filter?: Nullable<FilterLocation>): Promise<Nullable<Locations>>;

  locationsByIds(ids: number[]): Promise<Nullable<LocationResponse[]>>;

  episode(id: number): Promise<Nullable<EpisodeResponse>>;

  episodes(page?: Nullable<number>, filter?: Nullable<FilterEpisode>): Promise<Nullable<Episodes>>;

  episodesByIds(ids: number[]): Promise<Nullable<EpisodeResponse[]>>;
}
