/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Test, type TestingModule } from "@nestjs/testing";
import { GraphqlResolver } from "./graphql.resolver";
import { AppModule } from "../app.module";
import { SeedController } from "../seed/seed.controller";

const MAX_PAGINATION_RESULTS = 20;

describe("GraphqlResolver", () => {
  let module: TestingModule;
  let resolver: GraphqlResolver;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    resolver = module.get<GraphqlResolver>(GraphqlResolver);

    const seedController = module.get<SeedController>(SeedController);
    await seedController.create();
  });

  afterAll(() => module.close());

  const expectPagination = (body: any) => {
    expect(typeof body).toBe("object");
    expect(typeof body.info).toBe("object");
    expect(typeof body.info.count).toBe("number");
    expect(typeof body.info.pages).toBe("number");
    expect(Array.isArray(body.results)).toBeTruthy();
    expect(body.results.length).toBeLessThanOrEqual(MAX_PAGINATION_RESULTS);
  };

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });

  it("should get one character", async () => {
    const character = await resolver.character(1);

    expect(character).not.toBeNull();
    expect(character.id).toBe(1);
  });

  it("should get pagination response", async () => {
    const character = await resolver.characters();

    expect(character).not.toBeNull();
    expectPagination(character);
  });

  it("should get characters by ids", async () => {
    const characters = await resolver.charactersByIds([1, 2, 3]);

    expect(characters).not.toBeNull();
    expect(characters.length).toBe(3);
  });

  it("should get one character by ids", async () => {
    const character = await resolver.charactersByIds([1]);

    expect(character).not.toBeNull();
    expect(character.length).toBe(1);
  });

  it("should get one location", async () => {
    const location = await resolver.location(1);

    expect(location).not.toBeNull();
    expect(location.id).toBe(1);
  });

  it("should get pagination response", async () => {
    const location = await resolver.locations();

    expect(location).not.toBeNull();
    expectPagination(location);
  });

  it("should get locations by ids", async () => {
    const locations = await resolver.locationsByIds([1, 2, 3]);

    expect(locations).not.toBeNull();
    expect(locations.length).toBe(3);
  });

  it("should get one location by ids", async () => {
    const location = await resolver.locationsByIds([1]);

    expect(location).not.toBeNull();
    expect(location.length).toBe(1);
  });

  it("should get one episode", async () => {
    const episode = await resolver.episode(1);

    expect(episode).not.toBeNull();
    expect(episode.id).toBe(1);
  });

  it("should get pagination response", async () => {
    const episode = await resolver.episodes();

    expect(episode).not.toBeNull();
    expectPagination(episode);
  });

  it("should get episodes by ids", async () => {
    const episodes = await resolver.episodesByIds([1, 2, 3]);

    expect(episodes).not.toBeNull();
    expect(episodes.length).toBe(3);
  });

  it("should get one episode by ids", async () => {
    const episode = await resolver.episodesByIds([1]);

    expect(episode).not.toBeNull();
    expect(episode.length).toBe(1);
  });
});
