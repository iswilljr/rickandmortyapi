import { BadRequestException, Logger, NotFoundException } from "@nestjs/common";
import { CRUDServiceOptions } from "common/interfaces/crud.interface";
import type { DeepPartial, FindManyOptions, FindOptionsWhere, ObjectLiteral, Repository } from "typeorm";

export class CRUDService<Entity extends ObjectLiteral, Response> {
  private readonly logger: Logger;

  constructor(
    private readonly repository: Repository<Entity>,
    private readonly options: CRUDServiceOptions<Entity, Response>
  ) {
    this.logger = new Logger(options.loggerName);
  }

  async create(entityLike: DeepPartial<Entity> | Array<DeepPartial<Entity>>): Promise<void> {
    try {
      const obj = this.repository.create(entityLike as DeepPartial<Entity>);

      await this.repository.save(obj);
    } catch (error) {
      this.handlerError(error);
    }
  }

  async findAll(options?: FindManyOptions<Entity>): Promise<Array<ReturnType<typeof this.options.transformObj>>> {
    try {
      const objs = await this.repository.find(options);
      return objs.map(this.options.transformObj);
    } catch (error) {
      this.handlerError(error);
    }
  }

  async findOneBy(
    where: FindOptionsWhere<Entity> | Array<FindOptionsWhere<Entity>>
  ): Promise<ReturnType<typeof this.options.transformObj>> {
    try {
      const obj = await this.repository.findOneBy(where);
      if (obj) return this.options.transformObj(obj);
    } catch (error) {
      this.handlerError(error);
    }

    throw new NotFoundException(`Not found`);
  }

  async removeAll(): Promise<void> {
    const queryBuilder = this.repository.createQueryBuilder();

    try {
      await queryBuilder.delete().where({}).execute();
    } catch (error) {
      this.handlerError(error);
    }
  }

  private handlerError(error: any, InstanceError: any = BadRequestException): void {
    this.logger.error(error);

    throw new InstanceError(error.detail ?? error.message);
  }
}
