import { getUrl } from "common/helpers/get-url.helper";
import type { Episode } from "episode/entities/episode.entity";
import type { EpisodeResponse } from "common/interfaces/episode.interface";

export function transformEpisode(episode: Episode): EpisodeResponse {
  const { characters, uuid, ...episodeObj } = episode;

  return {
    ...episodeObj,
    url: getUrl({ endpoint: "episode", id: episode.id }),
    characters: characters?.map((character) => getUrl({ endpoint: "character", id: character.id })),
  };
}
