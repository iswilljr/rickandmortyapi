export interface CRUDServiceOptions<Entity, Response> {
  loggerName: string;
  transformObj: (obj: Entity) => Response;
}
