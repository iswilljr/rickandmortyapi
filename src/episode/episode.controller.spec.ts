import { Test, type TestingModule } from "@nestjs/testing";
import { AppModule } from "../app.module";
import { EpisodeController } from "./episode.controller";
import { getUrl } from "../common/helpers/get-url.helper";
import { SeedService } from "../seed/seed.service";
import type { EpisodeResponse } from "common/interfaces";

const MAX_PAGINATION_RESULTS = 20;

describe("EpisodeController", () => {
  let module: TestingModule;
  let controller: EpisodeController;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = module.get<EpisodeController>(EpisodeController);
    const seedController = module.get<SeedService>(SeedService);

    await seedController.seed();
  });

  afterAll(() => module.close());

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should return one episode", async () => {
    const idToSearch = 1;

    const one = (await controller.findOneOrMany([idToSearch])) as EpisodeResponse;

    expect(Array.isArray(one)).toBeFalsy();
    expect(one.id).toBe(idToSearch);
    expect(one.url).toBe(getUrl({ endpoint: "episode", id: idToSearch }));
  });

  it("should return many episodes", async () => {
    const idsToSearch = [1, 2];

    const results = (await controller.findOneOrMany(idsToSearch)) as EpisodeResponse[];

    expect(Array.isArray(results)).toBeTruthy();
    expect(results.length).toBe(idsToSearch.length);
  });

  it("should return pagination response", async () => {
    const response = await controller.findAll({});

    expect(response.info.prev).toBeNull();
    expect(response.info.next).toBe(getUrl({ endpoint: "episode", page: 2 }));
    expect(Array.isArray(response.results)).toBeTruthy();
    expect(response.results.length).toBe(MAX_PAGINATION_RESULTS);
  });

  it("should return pagination response with filter", async () => {
    const name = "rick";

    const response = await controller.findAll({ name, page: 2 });

    const result = response.results.every((result) => result.name.toLowerCase().includes(name));

    expect(response.info.count).toBeLessThanOrEqual(MAX_PAGINATION_RESULTS * 2);
    expect(response.info.next).toBeNull();
    expect(response.info.prev).toBe(getUrl({ endpoint: "episode", page: 1, query: { name } }));
    expect(result).toBeTruthy();
  });
});
