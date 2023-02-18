import { Test, type TestingModule } from "@nestjs/testing";
import { SeedService } from "./seed.service";
import { AppModule } from "../app.module";
import { existsSync, promises as fs } from "fs";
import * as path from "path";
import * as os from "os";
import type { CharacterResponse } from "../common/interfaces";

describe("SeedService", () => {
  let module: TestingModule;
  let service: SeedService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<SeedService>(SeedService);
  });

  afterAll(() => module.close());

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should seed the database", async () => {
    await expect(service.seed()).resolves.toEqual({ message: "OK" });
  });

  it("should cache the characters", async () => {
    const data = await service.getData<CharacterResponse>("/character");
    const cache: any = await service.cache("characters", async () => data);

    expect(cache.length).toBe(data.length);
  });

  it("should cache the data", async () => {
    const key = "key";
    const data = [1, 2, 3];
    const otherData = ["3", "2", "1"];

    const filePath = path.resolve(os.tmpdir(), "rickandmortyapi", `${key}.json`);

    if (existsSync(filePath)) await fs.rm(filePath);

    const cache: any = await service.cache(key, async () => data);
    const otherCache: any = await service.cache(key, async () => otherData);

    const existsFile = existsSync(filePath);

    expect(existsFile).toBeTruthy();
    expect(cache).toEqual(data);
    expect(otherCache).not.toEqual(otherData);
    expect(otherCache).toEqual(data);
  });

  it("should create cache dir", async () => {
    const key = "dirname";
    const dirname = path.resolve(os.tmpdir(), "rickandmortyapi");

    if (existsSync(dirname)) await fs.rm(dirname, { recursive: true });

    await service.cache(key, async () => 0);

    const existsDir = existsSync(dirname);

    expect(existsDir).toBeTruthy();
  });
});
