import { getUrl } from "common/helpers/get-url.helper";
import type { Location } from "location/entities/location.entity";
import type { LocationResponse } from "common/interfaces/location.interface";

export function transformLocation(location: Location): LocationResponse {
  const { residents, charactersOrigin, uuid, ...locationObj } = location;

  return {
    ...locationObj,
    url: getUrl({ enpoint: "location", id: location.id }),
    residents: residents?.map((resident) => getUrl({ enpoint: "character", id: resident.id })),
  };
}
