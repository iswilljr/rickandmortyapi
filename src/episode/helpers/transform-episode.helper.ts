import { getUrl } from "common/helpers/get-url.helper";
import type { Episode } from "episode/entities/episode.entity";
import type { EpisodeResponse } from "common/interfaces/episode.interface";

export function transformEpisode(episode: Episode): EpisodeResponse {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { id, name, air_date, episode: nEpisode, created, characters } = episode;

  return {
    id,
    name,
    air_date,
    episode: nEpisode,
    characters: characters?.map((character) => getUrl({ endpoint: "character", id: character.id })),
    url: getUrl({ endpoint: "episode", id: episode.id }),
    created,
  };
}
