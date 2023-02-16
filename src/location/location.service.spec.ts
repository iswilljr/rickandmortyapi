import { Test, type TestingModule } from "@nestjs/testing";
import { LocationService } from "./location.service";
import { AppModule } from "../app.module";

describe("TddService", () => {
  let module: TestingModule;
  let service: LocationService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<LocationService>(LocationService);
  });

  afterAll(async () => {
    await module.close();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
