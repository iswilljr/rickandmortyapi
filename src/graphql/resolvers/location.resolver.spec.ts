import { Test, type TestingModule } from "@nestjs/testing";
import { LocationResolver } from "./location.resolver";
import { AppModule } from "../../app.module";
import { getUrl } from "../../common/helpers/get-url.helper";
import { SeedController } from "../../seed/seed.controller";

describe("LocationResolver", () => {
  let module: TestingModule;
  let resolver: LocationResolver;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    resolver = module.get<LocationResolver>(LocationResolver);

    const seedController = module.get<SeedController>(SeedController);
    await seedController.create();
  });

  afterAll(() => module.close());

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });

  it("should get the locations residents", async () => {
    const ids = [1, 2, 3];

    const characters = await resolver.residents({
      residents: ids.map((id) => getUrl({ endpoint: "episode", id })),
    });

    expect(characters).not.toBeNull();

    characters.forEach((episode, i) => {
      expect(episode).not.toBeNull();
      expect(episode.id).toBe(ids[i]);
    });
  });

  it("should get one resident", async () => {
    const residents = await resolver.residents({
      residents: [getUrl({ endpoint: "character", id: 1 })],
    });

    expect(residents).not.toBeNull();
    expect(residents.length).toBe(1);
  });

  it("should get an empty residents array", async () => {
    const characters = await resolver.residents({
      residents: [],
    });

    expect(characters.length).toBe(0);
  });
});
