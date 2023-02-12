import { Controller, Get, Query } from "@nestjs/common";
import { Id } from "../common/decorators/id.decorator";
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
  findOneOrMany(@Id() id: number[]): Promise<LocationResponse | LocationResponse[]> {
    return this.locationService.findOneOrMany(id);
  }
}
