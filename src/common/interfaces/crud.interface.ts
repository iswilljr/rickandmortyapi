import type { FindManyOptions } from "typeorm";
import type { PaginationDto } from "common/dto/pagination.dto";

export type Endpoints = "character" | "character/avatar" | "episode" | "location";

export interface CRUDServiceOptions<Entity, Response> {
  endpoint: Endpoints;
  loggerName: string;
  transformObj: (obj: Entity) => Response;
}

export interface CRUDServiceFindAllOptions<Entity> {
  query: Partial<Record<keyof Entity, string>> & PaginationDto;
  options?: Omit<FindManyOptions<Entity>, "skip" | "take" | "order" | "where">;
}
