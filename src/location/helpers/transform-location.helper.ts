import { getUrl } from "../../common/helpers/get-url.helper";
import { sortById } from "../../common/helpers/sort-by-id.helper";
import type { Location } from "../../location/entities/location.entity";
import type { LocationResponse } from "../../common/interfaces/location.interface";

export function transformLocation(location: Location): LocationResponse {
  const { id, name, type, dimension, residents, created } = location;

  return {
    id,
    name,
    type,
    dimension,
    residents: residents?.map((resident) => getUrl({ endpoint: "character", id: resident.id })).sort(sortById),

    url: getUrl({ endpoint: "location", id: location.id }),
    created,
  };
}
