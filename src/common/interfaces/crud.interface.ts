export type Endpoints = "character" | "episode" | "location";

export interface CRUDServiceOptions<Entity, Response> {
  endpoint: Endpoints;
  loggerName: string;
  transformObj: (obj: Entity) => Response;
}
