import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CRUDService } from "common/classes/crud.service";
import { Location } from "./entities/location.entity";
import { transformLocation } from "./helpers/transform-location.helper";
import type { Repository } from "typeorm";
import type { LocationResponse } from "common/interfaces/location.interface";

@Injectable()
export class LocationService extends CRUDService<Location, LocationResponse> {
  constructor(@InjectRepository(Location) locationRepository: Repository<Location>) {
    super(locationRepository, {
      loggerName: "LocationService",
      transformObj: transformLocation,
      endpoint: "location",
    });
  }
}
