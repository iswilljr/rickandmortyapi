import { Resolver, ResolveField, Parent } from "@nestjs/graphql";
import { getIdFromURL } from "../../common/helpers/get-id-from-url.helper";
import { GraphqlService } from "../graphql.service";
import type { CharacterResponse, EpisodeResponse } from "../../common/interfaces";
import { PartialWith } from "graphql/interfaces";

@Resolver("Episode")
export class EpisodeResolver {
  constructor(private readonly graphqlService: GraphqlService) {}

  @ResolveField("characters")
  async characters(@Parent() parent: PartialWith<EpisodeResponse, "characters">): Promise<CharacterResponse[]> {
    if (!parent.characters || parent.characters.length < 1) return [];

    const ids = parent.characters.map(getIdFromURL);

    const residents = await this.graphqlService.findOneOrManyCharacters(ids);

    return Array.isArray(residents) ? residents : [residents];
  }
}
