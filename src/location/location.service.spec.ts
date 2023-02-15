import { Test, type TestingModule } from "@nestjs/testing";
import { LocationService } from "./location.service";

describe("TddService", () => {
  let service: LocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocationService],
    }).compile();

    service = module.get<LocationService>(LocationService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
