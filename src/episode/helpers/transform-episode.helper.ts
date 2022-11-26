import type { Episode } from "episode/entities/episode.entity";
import type { EpisodeResponse } from "common/interfaces/episode.interface";

export function transformEpisode(character: Episode): EpisodeResponse {
  const { characters, uuid, ...characterObj } = character;

  return {
    characters: characters?.map((character) => character.url),
    ...characterObj,
  };
}
