import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { Page } from "common/decorators/page.decorator";
import { LocationService } from "./location.service";
import type { FindOptionsRelations } from "typeorm";
import type { LocationResponse } from "common/interfaces/location.interface";
import type { PaginationResponse } from "common/interfaces";
import type { Location } from "./entities/location.entity";

@Controller("location")
export class LocationController {
  private readonly loadRelations: FindOptionsRelations<Location> = { residents: true };

  constructor(private readonly locationService: LocationService) {}

  @Get()
  findAll(@Page() page: number): Promise<PaginationResponse<LocationResponse>> {
    return this.locationService.findAll(page, { relations: this.loadRelations });
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): Promise<LocationResponse> {
    return this.locationService.findOneBy({ id }, { relations: this.loadRelations });
  }
}
