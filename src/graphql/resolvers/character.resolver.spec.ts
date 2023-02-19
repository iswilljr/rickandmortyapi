import { Test, type TestingModule } from "@nestjs/testing";
import { CharacterResolver } from "./character.resolver";
import { AppModule } from "../../app.module";
import { getUrl } from "../../common/helpers/get-url.helper";
import { SeedController } from "../../seed/seed.controller";

describe("CharacterResolver", () => {
  let module: TestingModule;
  let resolver: CharacterResolver;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    resolver = module.get<CharacterResolver>(CharacterResolver);

    const seedController = module.get<SeedController>(SeedController);
    await seedController.create();
  });

  afterAll(() => module.close());

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });

  it("should get the character location", async () => {
    const location = await resolver.location({
      location: {
        name: "Earth",
        url: getUrl({ endpoint: "location", id: 1 }),
      },
    });

    expect(location).not.toBeNull();
    expect(location?.id).toBe(1);
  });

  it("should not get the character location", async () => {
    const location = await resolver.location({
      location: {
        name: "",
        url: "",
      },
    });

    expect(location).toBeNull();
  });

  it("should get the character origin", async () => {
    const origin = await resolver.origin({
      origin: {
        name: "Earth",
        url: getUrl({ endpoint: "location", id: 1 }),
      },
    });

    expect(origin).not.toBeNull();
    expect(origin?.id).toBe(1);
  });

  it("should not get the character origin", async () => {
    const origin = await resolver.origin({
      origin: {
        name: "",
        url: "",
      },
    });

    expect(origin).toBeNull();
  });

  it("should get the character episodes", async () => {
    const ids = [1, 2, 3];

    const episodes = await resolver.episodes({
      episode: ids.map((id) => getUrl({ endpoint: "episode", id })),
    });

    expect(episodes).not.toBeNull();

    episodes.forEach((episode, i) => {
      expect(episode).not.toBeNull();
      expect(episode.id).toBe(ids[i]);
    });
  });

  it("should get one episode", async () => {
    const episodes = await resolver.episodes({
      episode: [getUrl({ endpoint: "episode", id: 1 })],
    });

    expect(episodes).not.toBeNull();
    expect(episodes.length).toBe(1);
  });

  it("should get an empty episodes array", async () => {
    const episodes = await resolver.episodes({
      episode: [],
    });

    expect(episodes.length).toBe(0);
  });
});
