/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Resolver, ResolveField, Parent } from "@nestjs/graphql";
import { getIdFromURL } from "../../common/helpers/get-id-from-url.helper";
import { GraphqlService } from "../graphql.service";
import type { CharacterResponse, EpisodeResponse, LocationResponse } from "../../common/interfaces";
import { PartialWith } from "graphql/interfaces";

@Resolver("Character")
export class CharacterResolver {
  constructor(private readonly graphqlService: GraphqlService) {}

  @ResolveField("episode")
  async episodes(@Parent() parent: PartialWith<CharacterResponse, "episode">): Promise<EpisodeResponse[]> {
    if (!parent.episode.length) return [];

    const ids = parent.episode.map(getIdFromURL);

    const episodes = await this.graphqlService.findOneOrManyEpisodes(ids);

    return Array.isArray(episodes) ? episodes : [episodes];
  }

  @ResolveField("location")
  async location(@Parent() parent: PartialWith<CharacterResponse, "location">): Promise<LocationResponse | null> {
    return this.getLocation(parent.location.url);
  }

  @ResolveField("origin")
  async origin(@Parent() parent: PartialWith<CharacterResponse, "origin">): Promise<LocationResponse | null> {
    return this.getLocation(parent.origin.url);
  }

  private async getLocation(url?: string | null): Promise<LocationResponse | null> {
    if (!url) return null;

    const location = (await this.graphqlService.findOneOrManyLocations(getIdFromURL(url))) as LocationResponse;

    return location;
  }
}
