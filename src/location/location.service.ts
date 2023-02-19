import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CRUDService } from "../common/classes/crud.service";
import { Location } from "./entities/location.entity";
import { transformLocation } from "./helpers/transform-location.helper";
import { locationOptions } from "./helpers/relations.helper";
import { Repository } from "typeorm";
import type { LocationResponse } from "../common/interfaces/location.interface";
import type { LocationQueryDto } from "./dto/location-query.dto";
import type { PaginationResponse } from "../common/interfaces";

@Injectable()
export class LocationService {
  private readonly locationOptions = locationOptions;

  readonly crud: CRUDService<Location, LocationResponse>;

  constructor(@InjectRepository(Location) locationRepository: Repository<Location>) {
    this.crud = new CRUDService(locationRepository, {
      loggerName: "LocationService",
      transformObj: transformLocation,
      endpoint: "location",
    });
  }

  findOneOrMany(id: number[]): Promise<LocationResponse | LocationResponse[]> {
    return this.crud.findOneOrMany(id, this.locationOptions);
  }

  findAll(query: LocationQueryDto): Promise<PaginationResponse<LocationResponse>> {
    return this.crud.findAll({ query, options: this.locationOptions });
  }
}
