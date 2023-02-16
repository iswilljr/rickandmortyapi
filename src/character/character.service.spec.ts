import { Test, type TestingModule } from "@nestjs/testing";
import { AppModule } from "../app.module";
import { CharacterService } from "./character.service";

describe("TddService", () => {
  let module: TestingModule;
  let service: CharacterService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<CharacterService>(CharacterService);
  });

  afterAll(async () => {
    await module.close();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
