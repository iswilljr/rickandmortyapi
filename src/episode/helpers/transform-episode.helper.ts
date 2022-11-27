import { getUrl } from "common/helpers/get-url.helper";
import type { Episode } from "episode/entities/episode.entity";
import type { EpisodeResponse } from "common/interfaces/episode.interface";

export function transformEpisode(episode: Episode): EpisodeResponse {
  const { characters, uuid, ...episodeObj } = episode;

  return {
    ...episodeObj,
    url: getUrl({ enpoint: "episode", id: episode.id }),
    characters: characters?.map((character) => getUrl({ enpoint: "character", id: character.id })),
  };
}
