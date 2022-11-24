import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CRUDService } from "common/classes/crud.service";
import { Repository } from "typeorm";
import { Location } from "./entities/location.entity";

@Injectable()
export class LocationService extends CRUDService<Location> {
  constructor(@InjectRepository(Location) locationRepository: Repository<Location>) {
    super(locationRepository, "LocationService");
  }
}
