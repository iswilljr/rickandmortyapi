import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { Auth } from "common/decorators/auth.decorator";
import { LocationService } from "./location.service";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";

@Controller("location")
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  findAll(): string {
    return this.locationService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string): string {
    return this.locationService.findOne(+id);
  }

  @Post()
  @Auth()
  create(@Body() createLocationDto: CreateLocationDto): string {
    return this.locationService.create(createLocationDto);
  }

  @Patch(":id")
  @Auth()
  update(@Param("id") id: string, @Body() updateLocationDto: UpdateLocationDto): string {
    return this.locationService.update(+id, updateLocationDto);
  }

  @Delete(":id")
  @Auth()
  remove(@Param("id") id: string): string {
    return this.locationService.remove(+id);
  }
}
