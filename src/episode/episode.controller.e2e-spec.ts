/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Test, type TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../app.module";
import { getUrl } from "../common/helpers/get-url.helper";
import { SeedService } from "../seed/seed.service";
import { type INestApplication, ValidationPipe } from "@nestjs/common";

const MAX_PAGINATION_RESULTS = 20;

const episodeKeys = ["id", "name", "air_date", "episode", "characters", "url", "created"];

describe("EpisodeController (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    await app.init();

    const seedModule = app.get<SeedService>(SeedService);

    await seedModule.seed();
  });

  afterAll(() => app.close());

  const get = (path: string | number = "", status = 200) =>
    request(app.getHttpServer()).get(`/episode/${path}`).expect(status).expect("Content-Type", /json/);

  const expectPagination = (body: any) => {
    expect(typeof body).toBe("object");
    expect(typeof body.info).toBe("object");
    expect(typeof body.info.count).toBe("number");
    expect(typeof body.info.pages).toBe("number");
    expect(Array.isArray(body.results)).toBeTruthy();
    expect(body.results.length).toBeLessThanOrEqual(MAX_PAGINATION_RESULTS);
  };

  const expectEpisode = (body: any, id: number) => {
    expect(typeof body).toBe("object");
    expect(body.url).toBe(getUrl({ endpoint: "episode", id }));
    expect(Object.keys(body)).toEqual(episodeKeys);
  };

  const expectError = (body: any, message = "Not Found") => {
    expect(body.statusCode).toBe(404);
    expect(body.message).toBe(message);
    expect(body.error).toBe("Not Found");
  };

  it("should get all episodes", async () => {
    const response = await get();

    expectPagination(response.body);
    expect(response.body.info.prev).toBeNull();
    expect(response.body.info.next).toBe(getUrl({ endpoint: "episode", page: 2 }));
  });

  it("should get all episodes in page 2", async () => {
    const response = await get("?page=2");

    expect(response.body.info.prev).toBe(getUrl({ endpoint: "episode", page: 1 }));
    expect(response.body.info.next).toBe(getUrl({ endpoint: "episode", page: 3 }));
    expectPagination(response.body);
  });

  it("should get all episodes with filter", async () => {
    const response = await get("?episode=S01");

    expectPagination(response.body);
    expect(response.body.info.prev).toBeNull();
    expect(response.body.info.next).toBeNull();
    expect(response.body.results.every((episode) => episode.episode.includes("S01"))).toBeTruthy();
  });

  it("should get one episode", async () => {
    const response = await get(1);

    expectEpisode(response.body, 1);
  });

  it("should get many episode", async () => {
    const ids = [1, 2, 3];

    const response = await get(ids.join(","));

    expect(Array.isArray(response.body)).toBeTruthy();

    response.body.forEach((episode, i) => {
      expectEpisode(episode, ids[i]);
    });
  });

  it("should get many episode and sort the array", async () => {
    const ids = [3, 2, 1];

    const response = await get(ids.join(","));

    expect(Array.isArray(response.body)).toBeTruthy();

    response.body.forEach((episode, i) => {
      expect(ids.includes(episode.id)).toBeTruthy();
      expectEpisode(episode, ids[ids.length - i - 1]);
    });
  });

  it("should throw a pagination error", async () => {
    const response = await get("?page=5000", 404);

    expectError(response.body, "Page Not Found");
  });

  it("should throw a pagination error when filtering", async () => {
    const response = await get("?name=somerandomname", 404);

    expectError(response.body, "Page Not Found");
  });

  it("should throw error message when getting one episode", async () => {
    const response = await get(5000, 404);

    expectError(response.body);
  });

  it("should throw error message when getting many episodes", async () => {
    const response = await get("4000,5000", 404);

    expectError(response.body);
  });
});
