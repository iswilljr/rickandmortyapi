import type { Location } from "location/entities/location.entity";
import type { LocationResponse } from "common/interfaces/location.interface";

export function transformLocation(character: Location): LocationResponse {
  const { residents, charactersLocation, charactersOrigin, uuid, ...characterObj } = character;

  return {
    residents: residents.map((resident) => resident.url),
    ...characterObj,
  };
}
