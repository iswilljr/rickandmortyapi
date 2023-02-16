import { Test, type TestingModule } from "@nestjs/testing";
import { AppModule } from "../app.module";
import { CharacterController } from "./character.controller";

describe("TddController", () => {
  let module: TestingModule;
  let controller: CharacterController;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = module.get<CharacterController>(CharacterController);
  });

  afterAll(async () => {
    await module.close();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
