import { Test, type TestingModule } from "@nestjs/testing";
import { EpisodeService } from "./episode.service";
import { AppModule } from "../app.module";
import { getUrl } from "../common/helpers/get-url.helper";
import type { EpisodeResponse } from "common/interfaces";

const data = [
  {
    id: 1,
    name: "Pilot",
    air_date: "December 2, 2013",
    episode: "S01E01",
    created: "2017-11-10T12:56:33.798Z",
  },
  {
    id: 2,
    name: "Lawnmower Dog",
    air_date: "December 9, 2013",
    episode: "S01E02",
    created: "2017-11-10T12:56:33.916Z",
  },
  {
    id: 3,
    name: "A Rickle in Time",
    air_date: "July 26, 2015",
    episode: "S02E01",
    created: "2017-11-10T12:56:34.953Z",
  },
];

const MAX_PAGINATION_RESULTS = 20;

describe("EpisodeService", () => {
  let module: TestingModule;
  let service: EpisodeService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<EpisodeService>(EpisodeService);
  });

  afterAll(() => module.close());

  beforeEach(async () => {
    await service.crud.removeAll();
    await service.crud.create(data);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return one episode", async () => {
    const one = (await service.findOneOrMany([data[0].id])) as EpisodeResponse;

    expect(Array.isArray(one)).toBeFalsy();
    expect(one.id).toBe(data[0].id);
    expect(one.url).toBe(getUrl({ endpoint: "episode", id: data[0].id }));
  });

  it("should return many episodes", async () => {
    const results = (await service.findOneOrMany(data.map((episode) => episode.id))) as EpisodeResponse[];

    expect(Array.isArray(results)).toBeTruthy();
    expect(results.length).toBe(data.length);
  });

  it("should return pagination response", async () => {
    const response = await service.findAll({});

    expect(response.info).toEqual({
      count: data.length,
      pages: Math.ceil(data.length / MAX_PAGINATION_RESULTS),
      prev: null,
      next: null,
    });
    expect(response.results.length).toBe(data.length);
  });

  it("should return pagination response with filter", async () => {
    const season = "s01";

    const response = await service.findAll({ episode: season });

    const count = data.filter((episode) => episode.episode.toLowerCase().includes(season)).length;

    expect(response.info).toEqual({ count, pages: Math.ceil(count / MAX_PAGINATION_RESULTS), prev: null, next: null });
    expect(response.results.length).toBe(count);
  });
});
