import { Module } from "@nestjs/common";
import { LocationService } from "./location.service";
import { LocationController } from "./location.controller";
import { ConfigService } from "@nestjs/config";

@Module({
  controllers: [LocationController],
  providers: [LocationService, ConfigService],
})
export class LocationModule {}
