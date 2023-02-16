import { Test, type TestingModule } from "@nestjs/testing";
import { AppModule } from "../app.module";
import { EpisodeController } from "./episode.controller";

describe("TddController", () => {
  let module: TestingModule;
  let controller: EpisodeController;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = module.get<EpisodeController>(EpisodeController);
  });

  afterAll(async () => {
    await module.close();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
