import type { Episode } from "episode/entities/episode.entity";
import type { FindManyOptions } from "typeorm";

export const episodeOptions: FindManyOptions<Episode> = {
  relations: {
    characters: true,
  },
  select: {
    characters: { id: true, uuid: true },
  },
};
