import { Injectable } from "@nestjs/common";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";

@Injectable()
export class LocationService {
  create(createLocationDto: CreateLocationDto): string {
    return "This action adds a new location";
  }

  findAll(): string {
    return `This action returns all location`;
  }

  findOne(id: number): string {
    return `This action returns a #${id} location`;
  }

  update(id: number, updateLocationDto: UpdateLocationDto): string {
    return `This action updates a #${id} location`;
  }

  remove(id: number): string {
    return `This action removes a #${id} location`;
  }
}
