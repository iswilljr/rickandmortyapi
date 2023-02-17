import { getUrl } from "../../common/helpers/get-url.helper";
import { sortById } from "../../common/helpers/sort-by-id.helper";
import type { Character } from "../../character/entities/character.entity";
import type { CharacterResponse } from "../../common/interfaces/character.interface";

export function transformCharacter(character: Character): CharacterResponse {
  const { id, name, status, species, type, gender, origin, location, image, episode, created } = character;

  return {
    id,
    name,
    status,
    species,
    type,
    gender,
    location: {
      name: location?.name ?? "unknown",
      url: location ? getUrl({ endpoint: "location", id: location.id }) : "",
    },
    origin: {
      name: origin?.name ?? "unknown",
      url: origin ? getUrl({ endpoint: "location", id: origin.id }) : "",
    },
    image: getUrl({ endpoint: "character/avatar", id: image }),
    episode: episode?.map?.((episode) => getUrl({ endpoint: "episode", id: episode.id })).sort(sortById),
    url: getUrl({ endpoint: "character", id: character.id }),
    created,
  };
}
