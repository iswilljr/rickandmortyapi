import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { LocationService } from "./location.service";
import { LocationResponse } from "common/interfaces/location.interface";
import { FindOptionsRelations } from "typeorm";
import { Location } from "./entities/location.entity";
import { PaginationResponse } from "common/interfaces";
import { Page } from "common/decorators/page.decorator";

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
