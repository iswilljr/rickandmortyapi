import { Resolver, ResolveField, Parent } from "@nestjs/graphql";
import { getIdFromURL } from "../../common/helpers/get-id-from-url.helper";
import { GraphqlService } from "../graphql.service";
import type { CharacterResponse, LocationResponse } from "../../common/interfaces";
import { PartialWith } from "graphql/interfaces";

@Resolver("Location")
export class LocationResolver {
  constructor(private readonly graphqlService: GraphqlService) {}

  @ResolveField("residents")
  async residents(@Parent() parent: PartialWith<LocationResponse, "residents">): Promise<CharacterResponse[]> {
    if (!parent.residents || parent.residents.length < 1) return [];

    const ids = parent.residents.map(getIdFromURL);

    const residents = await this.graphqlService.findOneOrManyCharacters(ids);

    return Array.isArray(residents) ? residents : [residents];
  }
}
