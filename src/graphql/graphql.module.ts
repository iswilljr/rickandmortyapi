import { Module } from "@nestjs/common";
import { CharacterModule } from "../character/character.module";
import { EpisodeModule } from "../episode/episode.module";
import { LocationModule } from "../location/location.module";
import { GraphqlService } from "./graphql.service";
import { GraphqlResolver } from "./graphql.resolver";
import { CharacterResolver } from "./resolvers/character.resolver";
import { LocationResolver } from "./resolvers/location.resolver";
import { EpisodeResolver } from "./resolvers/episode.resolver";

@Module({
  imports: [CharacterModule, EpisodeModule, LocationModule],
  providers: [GraphqlService, GraphqlResolver, CharacterResolver, LocationResolver, EpisodeResolver],
})
export class GraphqlModule {}
