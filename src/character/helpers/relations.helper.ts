import type { FindManyOptions } from "typeorm";
import type { Character } from "character/entities/character.entity";

export const characterOptions: FindManyOptions<Character> = {
  relations: {
    episode: true,
    origin: true,
    location: true,
  },
  select: {
    episode: { id: true, uuid: true },
    origin: { id: true, name: true },
    location: { id: true, name: true },
  },
};
