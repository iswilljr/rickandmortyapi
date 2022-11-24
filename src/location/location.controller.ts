import { Controller, Get, Post, Body, Param, ParseIntPipe } from "@nestjs/common";
import { Auth } from "common/decorators/auth.decorator";
import { LocationService } from "./location.service";
import { CreateLocationDto } from "./dto/create-location.dto";
import { Location } from "./entities/location.entity";

@Controller("location")
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  findAll(): Promise<Location[]> {
    return this.locationService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): Promise<Location> {
    return this.locationService.findOneBy({ id });
  }

  @Post()
  @Auth()
  create(@Body() createLocationDto: CreateLocationDto): Promise<Location> {
    return this.locationService.create(createLocationDto);
  }
}
