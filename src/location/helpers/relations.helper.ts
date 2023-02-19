import type { Location } from "location/entities/location.entity";
import type { FindManyOptions } from "typeorm";

export const locationOptions: FindManyOptions<Location> = {
  relations: {
    residents: true,
  },
  select: {
    residents: { id: true, uuid: true },
  },
};
