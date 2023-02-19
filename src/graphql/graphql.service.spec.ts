import { Test, type TestingModule } from "@nestjs/testing";
import { AppModule } from "../app.module";
import { GraphqlService } from "./graphql.service";
import { SeedController } from "../seed/seed.controller";
import { getUrl } from "../common/helpers/get-url.helper";
import type { CharacterResponse, EpisodeResponse, LocationResponse } from "../common/interfaces";

const MAX_PAGINATION_RESULTS = 20;

describe("GraphqlService", () => {
  let module: TestingModule;
  let service: GraphqlService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<GraphqlService>(GraphqlService);

    const seedController = module.get<SeedController>(SeedController);
    await seedController.create();
  });

  afterAll(() => module.close());

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const expectPagination = (body: any) => {
    expect(typeof body).toBe("object");
    expect(typeof body.info).toBe("object");
    expect(typeof body.info.count).toBe("number");
    expect(typeof body.info.pages).toBe("number");

    if (body.info.prev) expect(typeof body.info.prev).toBe("number");
    if (body.info.next) expect(typeof body.info.next).toBe("number");

    expect(Array.isArray(body.results)).toBeTruthy();
    expect(body.results.length).toBeLessThanOrEqual(MAX_PAGINATION_RESULTS);
  };

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should get characters pagination response", async () => {
    const characters = await service.findAllCharacters();
    expectPagination(characters);
  });

  it("should get locations pagination response", async () => {
    const locations = await service.findAllLocations();
    expectPagination(locations);
  });

  it("should get episodes pagination response", async () => {
    const episodes = await service.findAllEpisodes();
    expectPagination(episodes);
  });

  it("should get many characters", async () => {
    const ids = [1, 2, 3];
    const characters = (await service.findOneOrManyCharacters(ids)) as CharacterResponse[];

    characters.forEach((character, i) => {
      expect(character.id).toBe(ids[i]);
    });
  });

  it("should get one character", async () => {
    const character = (await service.findOneOrManyCharacters(1)) as CharacterResponse;

    expect(typeof character).toBe("object");
    expect(character.id).toBe(1);
  });

  it("should get many locations", async () => {
    const ids = [1, 2, 3];
    const locations = (await service.findOneOrManyLocations(ids)) as LocationResponse[];

    locations.forEach((location, i) => {
      expect(location.id).toBe(ids[i]);
    });
  });

  it("should get one location", async () => {
    const location = (await service.findOneOrManyLocations(1)) as LocationResponse;

    expect(typeof location).toBe("object");
    expect(location.id).toBe(1);
  });

  it("should get many episodes", async () => {
    const ids = [1, 2, 3];
    const episodes = (await service.findOneOrManyEpisodes(ids)) as EpisodeResponse[];

    episodes.forEach((episode, i) => {
      expect(episode.id).toBe(ids[i]);
    });
  });

  it("should get one episode", async () => {
    const character = (await service.findOneOrManyEpisodes(1)) as EpisodeResponse;

    expect(typeof character).toBe("object");
    expect(character.id).toBe(1);
  });

  it("should transform pagination response", () => {
    const prevPage = 2;

    const infoToTransForm = {
      count: 0,
      pages: 0,
      prev: getUrl({ endpoint: "character", page: prevPage }),
    };

    const response = service.transformPaginationResponse({ info: infoToTransForm, results: [] });

    expectPagination(response);
    expect(response.info.prev).toBe(prevPage);
    expect(response.info.next).toBeNull();
  });
});
