import { resolve } from "path";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, type ApolloDriverConfig } from "@nestjs/apollo";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ServeStaticModule } from "@nestjs/serve-static";
import { CharacterModule } from "./character/character.module";
import { EpisodeModule } from "./episode/episode.module";
import { LocationModule } from "./location/location.module";
import { GraphqlModule } from "./graphql/graphql.module";
import { typeDefs } from "./graphql/schema/typeDefs";
import { SeedModule } from "./seed/seed.module";
import { validationSchema } from "./config/env.config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import depthLimit from "graphql-depth-limit";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, "images"),
      serveRoot: "/character/avatar",
    }),
    ConfigModule.forRoot({
      validationSchema,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      ssl: process.env.NODE_ENV === "production",
      database: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_HOST,
      password: process.env.POSTGRES_PASSWORD,
      port: +(process.env.POSTGRES_PORT as string),
      username: process.env.POSTGRES_USER,
      autoLoadEntities: true,
      synchronize: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      typeDefs,
      cache: "bounded",
      driver: ApolloDriver,
      path: "/graphql",
      playground: true,
      validationRules: [depthLimit(4)],
      introspection: true,
    }),
    CharacterModule,
    EpisodeModule,
    LocationModule,
    SeedModule,
    GraphqlModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
