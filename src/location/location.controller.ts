import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { LocationService } from "./location.service";
import { LocationResponse } from "common/interfaces/location.interface";

@Controller("location")
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  findAll(): Promise<LocationResponse[]> {
    return this.locationService.findAll({ relations: { residents: true } });
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): Promise<LocationResponse> {
    return this.locationService.findOneBy({ id });
  }
}
