import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { LocationQueryDto } from "./dto/location-query.dto";
import { LocationService } from "./location.service";
import type { LocationResponse } from "common/interfaces/location.interface";
import type { PaginationResponse } from "common/interfaces";

@Controller("location")
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  findAll(@Query() query: LocationQueryDto): Promise<PaginationResponse<LocationResponse>> {
    return this.locationService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): Promise<LocationResponse> {
    return this.locationService.findOne(id);
  }
}
