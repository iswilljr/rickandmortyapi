import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Location } from "./entities/location.entity";
import { LocationController } from "./location.controller";
import { LocationService } from "./location.service";

@Module({
  imports: [TypeOrmModule.forFeature([Location])],
  controllers: [LocationController],
  providers: [LocationService, ConfigService],
  exports: [TypeOrmModule, LocationService],
})
export class LocationModule {}
