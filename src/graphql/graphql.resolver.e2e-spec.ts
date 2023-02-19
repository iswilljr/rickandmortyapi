/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Test, type TestingModule } from "@nestjs/testing";
import { type INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../app.module";
import { getUrl } from "../common/helpers/get-url.helper";
import { SeedService } from "../seed/seed.service";

const MAX_PAGINATION_RESULTS = 20;

const locationKeys = ["id", "name", "type", "dimension", "residents", "created"];
const episodeKeys = ["id", "name", "air_date", "episode", "characters", "created"];
const characterKeys = [
  "id",
  "name",
  "status",
  "species",
  "type",
  "gender",
  "location",
  "origin",
  "image",
  "episode",
  "created",
];

describe("GraphQLResolver (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    const seedModule = app.get<SeedService>(SeedService);

    await seedModule.seed();
  });

  afterAll(() => app.close());

  const get = async (query: string) => {
    const response = await request(app.getHttpServer())
      .post("/graphql")
      .set("Content-Type", "application/json")
      .send({ query: `query { ${query} }` });

    return response.body.errors ?? response.body.data;
  };

  const expectPagination = (body: any) => {
    expect(typeof body).toBe("object");
    expect(typeof body.info).toBe("object");
    expect(typeof body.info.count).toBe("number");
    expect(typeof body.info.pages).toBe("number");
    expect(Array.isArray(body.results)).toBeTruthy();
    expect(body.results.length).toBeLessThanOrEqual(MAX_PAGINATION_RESULTS);
  };

  const expectError = (errors: any, message = "Not Found") => {
    const expectedError = {
      message,
      extensions: {
        code: "404",
        response: { statusCode: 404, message, error: "Not Found" },
      },
    };

    expect(Array.isArray(errors)).toBeTruthy();

    errors.forEach((error) => {
      expect(error).toEqual(expectedError);
    });
  };

  // Characters

  it("should get all characters", async () => {
    const { characters } = await get(
      'characters(page: 2, filter: { name: "Rick" }) { info { count pages prev next } results { id name } }'
    );

    const fullOfRicks = characters.results.every((character) => character.name.toLowerCase().includes("rick"));

    expectPagination(characters);
    expect(fullOfRicks).toBeTruthy();
    expect(characters.info.prev).toBe(1);
    expect(characters.info.next).toBe(3);
  });

  it("should get one character", async () => {
    const { character } = await get(
      "character(id: 1) { id name status species type gender location { id } origin { id } image episode { id } created }"
    );

    expect(character.image).toBe(getUrl({ endpoint: "character/avatar", id: "1.jpeg" }));
    expect(Object.keys(character)).toEqual(characterKeys);
  });

  it("should get many character", async () => {
    const ids = [1, 2, 3];

    const { charactersByIds } = await get(`charactersByIds(ids: [${ids.join(",")}] ) { id }`);

    expect(Array.isArray(charactersByIds)).toBeTruthy();

    charactersByIds.forEach((character, i) => {
      expect(+character.id).toBe(ids[i]);
    });
  });

  it("should throw a pagination error", async () => {
    const response = await get('characters(page: 5000, filter: { name: "rick" }) { info { count } }');

    expectError(response, "Page Not Found");
  });

  it("should throw error message when getting one character", async () => {
    const response = await get("character(id: 10000) { id }");

    expectError(response);
  });

  it("should throw error message when getting many characters", async () => {
    const response = await get("charactersByIds(ids: [3000,1234]) { id }");

    expectError(response);
  });

  // Locations

  it("should get all locations", async () => {
    const { locations } = await get(
      'locations(filter: { name: "earth" }) { info { count pages prev next } results { id name } }'
    );

    const fullOfEarth = locations.results.every((location) => location.name.toLowerCase().includes("earth"));

    expectPagination(locations);
    expect(fullOfEarth).toBeTruthy();
    expect(locations.info.prev).toBeNull();
    expect(locations.info.next).toBe(2);
  });

  it("should get one location", async () => {
    const { location } = await get("location(id: 1) { id name type dimension residents { id } created }");

    expect(Object.keys(location)).toEqual(locationKeys);
  });

  it("should get many location", async () => {
    const ids = [1, 2, 3];

    const { locationsByIds } = await get(`locationsByIds(ids: [${ids.join(",")}] ) { id }`);

    expect(Array.isArray(locationsByIds)).toBeTruthy();

    locationsByIds.forEach((location, i) => {
      expect(+location.id).toBe(ids[i]);
    });
  });

  it("should throw a pagination error", async () => {
    const response = await get('locations(page: 1000, filter: { name: "earth" }) { info { count } }');

    expectError(response, "Page Not Found");
  });

  it("should throw error message when getting one location", async () => {
    const response = await get("location(id: 1000) { id }");

    expectError(response);
  });

  it("should throw error message when getting many locations", async () => {
    const response = await get("locationsByIds(ids: [1000,2233]) { id }");

    expectError(response);
  });

  // // Episodes

  it("should get all episodes", async () => {
    const { episodes } = await get(
      'episodes(filter: { episode: "S01" }) { info { count pages prev next } results { id episode } }'
    );

    const fullOfSeasonOne = episodes.results.every((obj) => obj.episode.toLowerCase().includes("s01"));

    expectPagination(episodes);
    expect(fullOfSeasonOne).toBeTruthy();
    expect(episodes.info.prev).toBeNull();
    expect(episodes.info.next).toBeNull();
  });

  it("should get one episode", async () => {
    const { episode } = await get("episode(id: 1) { id name air_date episode characters { id } created }");

    expect(Object.keys(episode)).toEqual(episodeKeys);
  });

  it("should get many episode", async () => {
    const ids = [1, 2, 3];

    const { episodesByIds } = await get(`episodesByIds(ids: [${ids.join(",")}] ) { id }`);

    expect(Array.isArray(episodesByIds)).toBeTruthy();

    episodesByIds.forEach((episode, i) => {
      expect(+episode.id).toBe(ids[i]);
    });
  });

  it("should throw a pagination error", async () => {
    const response = await get('episodes(page: 2000, filter: { name: "S20" }) { info { count } }');

    expectError(response, "Page Not Found");
  });

  it("should throw error message when getting one episode", async () => {
    const response = await get("episode(id: 100) { id }");

    expectError(response);
  });

  it("should throw error message when getting many episodes", async () => {
    const response = await get("episodesByIds(ids: [100,300]) { id }");

    expectError(response);
  });
});
