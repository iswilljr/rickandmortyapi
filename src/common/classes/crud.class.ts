import { BadRequestException, Logger, NotFoundException } from "@nestjs/common";
import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, ObjectLiteral, Repository } from "typeorm";

export class CRUD<Entity extends ObjectLiteral> {
  private readonly logger: Logger;

  constructor(private readonly repository: Repository<Entity>, loggerContext: string = Repository.name) {
    this.logger = new Logger(loggerContext);
  }

  async create(create: DeepPartial<Entity> | Array<DeepPartial<Entity>>): Promise<Entity> {
    try {
      const obj = this.repository.create(create as DeepPartial<Entity>);

      await this.repository.save(obj);

      return obj;
    } catch (error) {
      this.handlerError(error);
    }
  }

  async findAll(options?: FindManyOptions<Entity>): Promise<Entity[]> {
    try {
      const objs = await this.repository.find(options);
      return objs;
    } catch (error) {
      this.handlerError(error);
    }
  }

  async findOne(where: FindOneOptions<Entity>): Promise<Entity> {
    try {
      const obj = await this.repository.findOne(where);
      if (obj) return obj;
    } catch (error) {
      this.handlerError(error);
    }

    throw new NotFoundException(`Not found`);
  }

  async findOneBy(where: FindOptionsWhere<Entity> | Array<FindOptionsWhere<Entity>>): Promise<Entity> {
    try {
      const obj = await this.repository.findOneBy(where);
      if (obj) return obj;
    } catch (error) {
      this.handlerError(error);
    }

    throw new NotFoundException(`Not found`);
  }

  private handlerError(error: any, InstanceError: any = BadRequestException): void {
    this.logger.error(error);

    throw new InstanceError(error.detail ?? error.message);
  }
}
