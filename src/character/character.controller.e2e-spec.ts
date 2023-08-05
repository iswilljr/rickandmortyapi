/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Test, type TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../app.module";
import { getUrl } from "../common/helpers/get-url.helper";
import { SeedService } from "../seed/seed.service";
import { type INestApplication, ValidationPipe } from "@nestjs/common";

const MAX_PAGINATION_RESULTS = 20;

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
  "url",
  "created",
];

describe("CharacterController (e2e)", () => {
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
    request(app.getHttpServer()).get(`/character/${path}`).expect(status).expect("Content-Type", /json/);

  const expectPagination = (body: any) => {
    expect(typeof body).toBe("object");
    expect(typeof body.info).toBe("object");
    expect(typeof body.info.count).toBe("number");
    expect(typeof body.info.pages).toBe("number");
    expect(Array.isArray(body.results)).toBeTruthy();
    expect(body.results.length).toBeLessThanOrEqual(MAX_PAGINATION_RESULTS);
  };

  const expectCharacter = (body: any, id: number) => {
    expect(typeof body).toBe("object");
    expect(body.image).toBe(getUrl({ endpoint: "character/avatar", id: `${id}.jpeg` }));
    expect(body.url).toBe(getUrl({ endpoint: "character", id }));
    expect(Object.keys(body)).toEqual(characterKeys);
  };

  const expectError = (body: any, message = "Not Found") => {
    expect(body.statusCode).toBe(404);
    expect(body.message).toBe(message);
    expect(body.error).toBe("Not Found");
  };

  it("should get all characters", async () => {
    const response = await get();

    expectPagination(response.body);
    expect(response.body.info.prev).toBeNull();
    expect(response.body.info.next).toBe(getUrl({ endpoint: "character", page: 2 }));
  });

  it("should get all characters in page 10", async () => {
    const response = await get("?page=10");

    expect(response.body.info.prev).toBe(getUrl({ endpoint: "character", page: 9 }));
    expect(response.body.info.next).toBe(getUrl({ endpoint: "character", page: 11 }));
    expectPagination(response.body);
  });

  it("should get all characters with filter", async () => {
    const response = await get("?name=rick");

    expectPagination(response.body);
    expect(response.body.info.prev).toBeNull();
    expect(response.body.info.next).toBe(getUrl({ endpoint: "character", page: 2, query: { name: "rick" } }));
    expect(response.body.results.every((character) => character.name.toLowerCase().includes("rick"))).toBeTruthy();
  });

  it("should get one character", async () => {
    const response = await get(1);

    expectCharacter(response.body, 1);
  });

  it("should get many character", async () => {
    const ids = [1, 2, 3];

    const response = await get(ids.join(","));

    expect(Array.isArray(response.body)).toBeTruthy();

    response.body.forEach((character, i) => {
      expectCharacter(character, ids[i]);
    });
  });

  it("should get many character and sort the array", async () => {
    const ids = [3, 2, 1];

    const response = await get(ids.join(","));

    expect(Array.isArray(response.body)).toBeTruthy();

    response.body.forEach((character, i) => {
      expect(ids.includes(character.id)).toBeTruthy();
      expectCharacter(character, ids[ids.length - i - 1]);
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

  it("should throw error message when getting one character", async () => {
    const response = await get(5000, 404);

    expectError(response.body);
  });

  it("should throw error message when getting many characters", async () => {
    const response = await get("4000,5000", 404);

    expectError(response.body);
  });
});
