import { Test, type TestingModule } from "@nestjs/testing";
import { CharacterService } from "./character.service";

describe("TddService", () => {
  let service: CharacterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CharacterService],
    }).compile();

    service = module.get<CharacterService>(CharacterService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
