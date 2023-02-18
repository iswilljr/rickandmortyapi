import { Test, type TestingModule } from "@nestjs/testing";
import { CharacterService } from "./character.service";
import { AppModule } from "../app.module";
import { getUrl } from "../common/helpers/get-url.helper";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import type { CharacterResponse } from "common/interfaces";

const data = [
  {
    id: 1,
    name: "Rick Sanchez",
    status: "Alive",
    species: "Human",
    type: "",
    gender: "Male",
    image: "1.jpeg",
    created: "2017-11-04T18:48:46.250Z",
  },
  {
    id: 2,
    name: "Morty Smith",
    status: "Alive",
    species: "Human",
    type: "",
    gender: "Male",
    image: "2.jpeg",
    created: "2017-11-04T18:50:21.651Z",
  },
  {
    id: 3,
    name: "Evil Morty",
    status: "Alive",
    species: "Human",
    type: "",
    gender: "Male",
    image: "118.jpeg",
    created: "2017-12-26T16:13:41.103Z",
  },
];

const MAX_PAGINATION_RESULTS = 20;

describe("CharacterService", () => {
  let module: TestingModule;
  let service: CharacterService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<CharacterService>(CharacterService);
  });

  afterAll(() => module.close());

  beforeEach(async () => {
    await service.crud.removeAll();
    await service.crud.create(data);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return one character", async () => {
    const one = (await service.findOneOrMany([data[0].id])) as CharacterResponse;

    expect(Array.isArray(one)).toBeFalsy();
    expect(one.id).toBe(data[0].id);
    expect(one.url).toBe(getUrl({ endpoint: "character", id: data[0].id }));
  });

  it("should return many characters", async () => {
    const results = (await service.findOneOrMany(data.map((character) => character.id))) as CharacterResponse[];

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
    const name = "morty";

    const response = await service.findAll({ name });

    const count = data.filter((character) => character.name.toLowerCase().includes(name)).length;

    expect(response.info).toEqual({ count, pages: Math.ceil(count / MAX_PAGINATION_RESULTS), prev: null, next: null });
    expect(response.results.length).toBe(count);
  });

  it("should throw error BadRequest and NotFound exceptions", async () => {
    await Promise.all([
      expect(service.crud.create({})).rejects.toBeInstanceOf(BadRequestException),
      expect(service.crud.findAll({ query: { name: "somerandomname" } })).rejects.toBeInstanceOf(NotFoundException),
      expect(service.crud.findOneOrMany([5000])).rejects.toBeInstanceOf(NotFoundException),
    ]);
  });
});
