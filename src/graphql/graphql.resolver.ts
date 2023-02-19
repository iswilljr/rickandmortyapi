/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Resolver, Query, Args } from "@nestjs/graphql";
import { GraphqlService } from "./graphql.service";
import type { CharacterResponse, EpisodeResponse, LocationResponse } from "../common/interfaces";
import type {
  Characters,
  Definition,
  Episodes,
  Locations,
  FilterCharacter,
  FilterEpisode,
  FilterLocation,
} from "./interfaces";

@Resolver("Graphql")
export class GraphqlResolver implements Definition {
  constructor(private readonly graphqlService: GraphqlService) {}

  @Query("character")
  character(@Args("id") id: number): Promise<CharacterResponse> {
    return this.graphqlService.findOneOrManyCharacters([id]) as Promise<CharacterResponse>;
  }

  @Query("characters")
  characters(@Args("page") page?: number, @Args("filter") filter?: FilterCharacter): Promise<Characters> {
    return this.graphqlService.findAllCharacters(page, filter);
  }

  @Query("charactersByIds")
  async charactersByIds(@Args("ids") ids: number[]): Promise<CharacterResponse[]> {
    if (!ids.length) return [];

    const characters = await this.graphqlService.findOneOrManyCharacters(ids);

    return Array.isArray(characters) ? characters : [characters];
  }

  @Query("location")
  location(@Args("id") id: number): Promise<LocationResponse> {
    return this.graphqlService.findOneOrManyLocations([id]) as Promise<LocationResponse>;
  }

  @Query("locations")
  locations(@Args("page") page?: number, @Args("filter") filter?: FilterLocation): Promise<Locations> {
    return this.graphqlService.findAllLocations(page, filter);
  }

  @Query("locationsByIds")
  async locationsByIds(@Args("ids") ids: number[]): Promise<LocationResponse[]> {
    if (!ids.length) return [];

    const locations = await this.graphqlService.findOneOrManyLocations(ids);

    return Array.isArray(locations) ? locations : [locations];
  }

  @Query("episode")
  episode(@Args("id") id: number): Promise<EpisodeResponse> {
    return this.graphqlService.findOneOrManyEpisodes([id]) as Promise<EpisodeResponse>;
  }

  @Query("episodes")
  episodes(@Args("page") page?: number, @Args("filter") filter?: FilterEpisode): Promise<Episodes> {
    return this.graphqlService.findAllEpisodes(page, filter);
  }

  @Query("episodesByIds")
  async episodesByIds(@Args("ids") ids: number[]): Promise<EpisodeResponse[]> {
    if (!ids.length) return [];

    const episodes = await this.graphqlService.findOneOrManyEpisodes(ids);

    return Array.isArray(episodes) ? episodes : [episodes];
  }
}
