import { Injectable } from "@nestjs/common";

@Injectable()
export class SeedService {
  seed(): string {
    return "This action adds a new seed";
  }
}
