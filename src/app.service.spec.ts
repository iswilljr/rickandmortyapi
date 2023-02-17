import { Test, type TestingModule } from "@nestjs/testing";
import { AppService } from "./app.service";
import { AppModule } from "./app.module";
import { getUrl } from "./common/helpers/get-url.helper";

describe("AppService", () => {
  let module: TestingModule;
  let service: AppService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  afterAll(() => module.close());

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return all endpoint urls", async () => {
    const expected = {
      character: getUrl({ endpoint: "character" }),
      location: getUrl({ endpoint: "location" }),
      episode: getUrl({ endpoint: "episode" }),
    };

    expect(service.root()).toEqual(expected);
    expect(Object.keys(service.root())).toEqual(Object.keys(expected));
  });
});
