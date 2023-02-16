import { Test, type TestingModule } from "@nestjs/testing";
import { AppModule } from "../app.module";
import { EpisodeService } from "./episode.service";

describe("TddService", () => {
  let module: TestingModule;
  let service: EpisodeService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<EpisodeService>(EpisodeService);
  });

  afterAll(async () => {
    await module.close();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
