import { Test, type TestingModule } from "@nestjs/testing";
import { AppModule } from "./app.module";
import { AppController } from "./app.controller";
import { getUrl } from "./common/helpers/get-url.helper";

describe("AppController", () => {
  let module: TestingModule;
  let controller: AppController;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  afterAll(() => module.close());

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should return all endpoint urls", async () => {
    const expected = {
      character: getUrl({ endpoint: "character" }),
      location: getUrl({ endpoint: "location" }),
      episode: getUrl({ endpoint: "episode" }),
    };

    expect(controller.root()).toEqual(expected);
    expect(Object.keys(controller.root())).toEqual(Object.keys(expected));
  });
});
