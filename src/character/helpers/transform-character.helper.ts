import type { Character } from "character/entities/character.entity";
import type { CharacterResponse } from "common/interfaces/character.interface";

export function transformCharacter(character: Character): CharacterResponse {
  const { episode, location, origin, uuid, ...characterObj } = character;

  return {
    episode: episode?.map?.((episode) => episode.url),
    location: location ? { name: location.name, url: location.url } : undefined,
    origin: origin ? { name: origin.name, url: origin.url } : undefined,
    ...characterObj,
  };
}
