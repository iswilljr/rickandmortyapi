import { Test, type TestingModule } from "@nestjs/testing";
import { EpisodeResolver } from "./episode.resolver";
import { AppModule } from "../../app.module";
import { getUrl } from "../../common/helpers/get-url.helper";
import { SeedController } from "../../seed/seed.controller";

describe("EpisodeResolver", () => {
  let module: TestingModule;
  let resolver: EpisodeResolver;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    resolver = module.get<EpisodeResolver>(EpisodeResolver);

    const seedController = module.get<SeedController>(SeedController);
    await seedController.create();
  });

  afterAll(() => module.close());

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });

  it("should get the episode characters", async () => {
    const ids = [1, 2, 3];

    const characters = await resolver.characters({
      characters: ids.map((id) => getUrl({ endpoint: "episode", id })),
    });

    expect(characters).not.toBeNull();

    characters.forEach((episode, i) => {
      expect(episode).not.toBeNull();
      expect(episode.id).toBe(ids[i]);
    });
  });

  it("should get one character", async () => {
    const characters = await resolver.characters({
      characters: [getUrl({ endpoint: "character", id: 1 })],
    });

    expect(characters).not.toBeNull();
    expect(characters.length).toBe(1);
  });

  it("should get an empty characters array", async () => {
    const characters = await resolver.characters({
      characters: [],
    });

    expect(characters.length).toBe(0);
  });
});
