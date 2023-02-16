import { Controller, NotFoundException, Post } from "@nestjs/common";
import { SeedService } from "./seed.service";

@Controller("seed")
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  create(): Promise<Record<string, unknown>> {
    if (process.env.NODE_ENV === "production") {
      throw new NotFoundException("Cannot POST /seed");
    }

    return this.seedService.seed();
  }
}
