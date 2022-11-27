import type { Location } from "location/entities/location.entity";
import type { LocationResponse } from "common/interfaces/location.interface";

export function transformLocation(character: Location): LocationResponse {
  const { residents, charactersOrigin, uuid, ...characterObj } = character;

  return {
    ...characterObj,
    residents: residents?.map((resident) => resident.url),
  };
}
