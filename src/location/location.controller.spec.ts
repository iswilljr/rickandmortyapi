import { Test, type TestingModule } from "@nestjs/testing";
import { AppModule } from "../app.module";
import { LocationController } from "./location.controller";

describe("TddController", () => {
  let module: TestingModule;
  let controller: LocationController;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = module.get<LocationController>(LocationController);
  });

  afterAll(async () => {
    await module.close();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
