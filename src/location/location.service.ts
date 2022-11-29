import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CRUDService } from "common/classes/crud.service";
import { Location } from "./entities/location.entity";
import { transformLocation } from "./helpers/transform-location.helper";
import type { FindManyOptions, Repository } from "typeorm";
import type { LocationResponse } from "common/interfaces/location.interface";
import { LocationQueryDto } from "./dto/location-query.dto";
import { PaginationResponse } from "common/interfaces";

@Injectable()
export class LocationService {
  private readonly locationOptions: FindManyOptions<Location> = {
    relations: {
      residents: true,
    },
    select: {
      residents: { id: true, uuid: true },
    },
  };

  readonly crud: CRUDService<Location, LocationResponse>;

  constructor(@InjectRepository(Location) locationRepository: Repository<Location>) {
    this.crud = new CRUDService(locationRepository, {
      loggerName: "LocationService",
      transformObj: transformLocation,
      endpoint: "location",
    });
  }

  findOne(id: number): Promise<LocationResponse> {
    return this.crud.findOneBy({ id }, this.locationOptions);
  }

  findAll(query: LocationQueryDto): Promise<PaginationResponse<LocationResponse>> {
    return this.crud.findAll({ query, options: this.locationOptions });
  }
}
