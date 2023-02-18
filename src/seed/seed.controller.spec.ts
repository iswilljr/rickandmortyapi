import { Test, type TestingModule } from "@nestjs/testing";
import { SeedController } from "./seed.controller";
import { AppModule } from "../app.module";
import { NotFoundException } from "@nestjs/common";

describe("SeedController", () => {
  let module: TestingModule;
  let controller: SeedController;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = module.get<SeedController>(SeedController);
  });

  afterAll(() => module.close());

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should seed the database", async () => {
    await expect(controller.create()).resolves.toEqual({ message: "OK" });
  });

  it("should throw not found error", async () => {
    process.env.NODE_ENV = "production";

    expect(() => controller.create()).toThrow(NotFoundException);
  });
});
