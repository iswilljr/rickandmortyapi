import { Test, type TestingModule } from "@nestjs/testing";
import { LocationService } from "./location.service";
import { AppModule } from "../app.module";
import { getUrl } from "../common/helpers/get-url.helper";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import type { LocationResponse } from "common/interfaces";

const data = [
  {
    id: 1,
    name: "Earth (C-137)",
    type: "Planet",
    dimension: "Dimension C-137",
    created: "2017-11-10T12:42:04.162Z",
  },
  {
    id: 2,
    name: "Abadango",
    type: "Cluster",
    dimension: "unknown",
    created: "2017-11-10T13:06:38.182Z",
  },
  {
    id: 3,
    name: "Post-Apocalyptic Earth",
    type: "Planet",
    dimension: "Post-Apocalyptic Dimension",
    created: "2017-11-10T13:09:22.551Z",
  },
];

const MAX_PAGINATION_RESULTS = 20;

describe("LocationService", () => {
  let module: TestingModule;
  let service: LocationService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<LocationService>(LocationService);
  });

  afterAll(() => module.close());

  beforeEach(async () => {
    await service.crud.removeAll();
    await service.crud.create(data);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return one location", async () => {
    const one = (await service.findOneOrMany([data[0].id])) as LocationResponse;

    expect(Array.isArray(one)).toBeFalsy();
    expect(one.id).toBe(data[0].id);
    expect(one.url).toBe(getUrl({ endpoint: "location", id: data[0].id }));
  });

  it("should return many locations", async () => {
    const results = (await service.findOneOrMany(data.map((location) => location.id))) as LocationResponse[];

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
    const name = "earth";

    const response = await service.findAll({ name });

    const count = data.filter((location) => location.name.toLowerCase().includes(name)).length;

    expect(response.info).toEqual({ count, pages: Math.ceil(count / MAX_PAGINATION_RESULTS), prev: null, next: null });
    expect(response.results.length).toBe(count);
  });

  it("should throw error BadRequest and NotFound exceptions", async () => {
    await Promise.all([
      expect(service.crud.create({})).rejects.toBeInstanceOf(BadRequestException),
      expect(service.crud.findAll({ query: { id: "5000" } })).rejects.toBeInstanceOf(BadRequestException),
      expect(service.crud.findOneOrMany([{}] as any)).rejects.toBeInstanceOf(BadRequestException),

      expect(service.crud.findAll({ query: { name: "somerandomname" } })).rejects.toBeInstanceOf(NotFoundException),
      expect(service.crud.findOneOrMany([5000])).rejects.toBeInstanceOf(NotFoundException),
    ]);
  });
});
