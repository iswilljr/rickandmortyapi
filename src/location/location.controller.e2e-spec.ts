/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Test, type TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../app.module";
import { getUrl } from "../common/helpers/get-url.helper";
import { SeedService } from "../seed/seed.service";
import { type INestApplication, ValidationPipe } from "@nestjs/common";

const MAX_PAGINATION_RESULTS = 20;

const locationKeys = ["id", "name", "type", "dimension", "residents", "url", "created"];

describe("LocationController (e2e)", () => {
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
      })
    );

    await app.init();

    const seedModule = app.get<SeedService>(SeedService);

    await seedModule.seed();
  });

  afterAll(() => app.close());

  const get = (path: string | number = "", status = 200) =>
    request(app.getHttpServer()).get(`/location/${path}`).expect(status).expect("Content-Type", /json/);

  const expectPagination = (body: any) => {
    expect(typeof body).toBe("object");
    expect(typeof body.info).toBe("object");
    expect(typeof body.info.count).toBe("number");
    expect(typeof body.info.pages).toBe("number");
    expect(Array.isArray(body.results)).toBeTruthy();
    expect(body.results.length).toBeLessThanOrEqual(MAX_PAGINATION_RESULTS);
  };

  const expectLocation = (body: any, id: number) => {
    expect(typeof body).toBe("object");
    expect(body.url).toBe(getUrl({ endpoint: "location", id }));
    expect(Object.keys(body)).toEqual(locationKeys);
  };

  const expectError = (body: any, message = "Not Found") => {
    expect(body.statusCode).toBe(404);
    expect(body.message).toBe(message);
    expect(body.error).toBe("Not Found");
  };

  it("should get all locations", async () => {
    const response = await get();

    expectPagination(response.body);
    expect(response.body.info.prev).toBeNull();
    expect(response.body.info.next).toBe(getUrl({ endpoint: "location", page: 2 }));
  });

  it("should get all locations in page 3", async () => {
    const response = await get("?page=3");

    expect(response.body.info.prev).toBe(getUrl({ endpoint: "location", page: 2 }));
    expect(response.body.info.next).toBe(getUrl({ endpoint: "location", page: 4 }));
    expectPagination(response.body);
  });

  it("should get all locations with filter", async () => {
    const response = await get("?name=earth");

    expectPagination(response.body);
    expect(response.body.info.prev).toBeNull();
    expect(response.body.info.next).toBe(getUrl({ endpoint: "location", page: 2, query: { name: "earth" } }));
    expect(response.body.results.every((location) => location.name.toLowerCase().includes("earth"))).toBeTruthy();
  });

  it("should get one location", async () => {
    const response = await get(1);

    expectLocation(response.body, 1);
  });

  it("should get many location", async () => {
    const ids = [1, 2, 3];

    const response = await get(ids.join(","));

    expect(Array.isArray(response.body)).toBeTruthy();

    response.body.forEach((location, i) => {
      expectLocation(location, ids[i]);
    });
  });

  it("should get many location and sort the array", async () => {
    const ids = [3, 2, 1];

    const response = await get(ids.join(","));

    expect(Array.isArray(response.body)).toBeTruthy();

    response.body.forEach((location, i) => {
      expect(ids.includes(location.id)).toBeTruthy();
      expectLocation(location, ids[ids.length - i - 1]);
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
