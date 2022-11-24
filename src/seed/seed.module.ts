import { Module } from "@nestjs/common";
import { SeedService } from "./seed.service";
import { SeedController } from "./seed.controller";
import { ConfigService } from "@nestjs/config";

@Module({
  controllers: [SeedController],
  providers: [SeedService, ConfigService],
})
export class SeedModule {}
