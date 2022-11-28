import { getUrl } from "common/helpers/get-url.helper";
import type { Character } from "character/entities/character.entity";
import type { CharacterResponse } from "common/interfaces/character.interface";

export function transformCharacter(character: Character): CharacterResponse {
  const { episode, location, origin, image, uuid, ...characterObj } = character;

  return {
    ...characterObj,
    image: getUrl({ enpoint: "character/avatar", id: image }),
    url: getUrl({ enpoint: "character", id: character.id }),
    location: {
      name: location?.name ?? "unknown",
      url: location ? getUrl({ enpoint: "location", id: location.id }) : "",
    },
    origin: {
      name: origin?.name ?? "unknown",
      url: origin ? getUrl({ enpoint: "location", id: origin.id }) : "",
    },
    episode: episode?.map?.((episode) => getUrl({ enpoint: "episode", id: episode.id })),
  };
}
