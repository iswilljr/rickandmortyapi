import { Controller, Get, Post, Body, Param, ParseIntPipe } from "@nestjs/common";
import { Auth } from "common/decorators/auth.decorator";
import { LocationService } from "./location.service";
import { CreateLocationDto } from "./dto/create-location.dto";
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

  @Post()
  @Auth()
  create(@Body() createLocationDto: CreateLocationDto): Promise<LocationResponse> {
    return this.locationService.create(createLocationDto);
  }
}
