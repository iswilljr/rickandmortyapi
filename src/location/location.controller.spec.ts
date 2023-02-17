import { Test, type TestingModule } from "@nestjs/testing";
import { AppModule } from "../app.module";
import { LocationController } from "./location.controller";
import { getUrl } from "../common/helpers/get-url.helper";
import { SeedService } from "../seed/seed.service";
import type { LocationResponse } from "common/interfaces";

const MAX_PAGINATION_RESULTS = 20;

describe("LocationController", () => {
  let module: TestingModule;
  let controller: LocationController;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = module.get<LocationController>(LocationController);
    const seedController = module.get<SeedService>(SeedService);

    await seedController.seed();
  });

  afterAll(() => module.close());

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should return one location", async () => {
    const idToSearch = 1;

    const one = (await controller.findOneOrMany([idToSearch])) as LocationResponse;

    expect(Array.isArray(one)).toBeFalsy();
    expect(one.id).toBe(idToSearch);
    expect(one.url).toBe(getUrl({ endpoint: "location", id: idToSearch }));
  });

  it("should return many locations", async () => {
    const idsToSearch = [1, 2];

    const results = (await controller.findOneOrMany(idsToSearch)) as LocationResponse[];

    expect(Array.isArray(results)).toBeTruthy();
    expect(results.length).toBe(idsToSearch.length);
  });

  it("should return pagination response", async () => {
    const response = await controller.findAll({});

    expect(response.info.prev).toBeNull();
    expect(response.info.next).toBe(getUrl({ endpoint: "location", page: 2 }));
    expect(Array.isArray(response.results)).toBeTruthy();
    expect(response.results.length).toBe(MAX_PAGINATION_RESULTS);
  });

  it("should return pagination response with filter", async () => {
    const name = "earth";

    const response = await controller.findAll({ name, page: 2 });

    const result = response.results.every((result) => result.name.toLowerCase().includes(name));

    expect(response.info.count).toBeLessThanOrEqual(MAX_PAGINATION_RESULTS * 2);
    expect(response.info.next).toBeNull();
    expect(response.info.prev).toBe(getUrl({ endpoint: "location", page: 1, query: { name } }));
    expect(result).toBeTruthy();
  });
});
