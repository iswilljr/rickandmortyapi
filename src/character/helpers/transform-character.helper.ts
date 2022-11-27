import type { Character } from "character/entities/character.entity";
import type { CharacterResponse } from "common/interfaces/character.interface";

export function transformCharacter(character: Character): CharacterResponse {
  const { episode, location, origin, uuid, ...characterObj } = character;

  return {
    ...characterObj,
    location: location ? { name: location.name, url: location.url } : undefined,
    origin: origin ? { name: origin.name, url: origin.url } : undefined,
    episode: episode?.map?.((episode) => episode.url),
  };
}
