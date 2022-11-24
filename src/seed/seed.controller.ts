import { Controller, Post } from "@nestjs/common";
import { Auth } from "common/decorators/auth.decorator";
import { SeedService } from "./seed.service";

@Controller("seed")
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @Auth()
  create(): string {
    return this.seedService.seed();
  }
}
