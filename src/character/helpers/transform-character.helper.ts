import { getUrl } from "common/helpers/get-url.helper";
import type { Character } from "character/entities/character.entity";
import type { CharacterResponse } from "common/interfaces/character.interface";

export function transformCharacter(character: Character): CharacterResponse {
  const { episode, location, origin, uuid, ...characterObj } = character;

  return {
    ...characterObj,
    url: getUrl({ enpoint: "character", id: character.id }),
    location: location ? { name: location.name, url: getUrl({ enpoint: "location", id: location.id }) } : undefined,
    origin: origin ? { name: origin.name, url: getUrl({ enpoint: "location", id: origin.id }) } : undefined,
    episode: episode?.map?.((episode) => getUrl({ enpoint: "episode", id: episode.id })),
  };
}
