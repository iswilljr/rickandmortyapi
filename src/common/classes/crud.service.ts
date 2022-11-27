import { BadRequestException, Logger, NotFoundException } from "@nestjs/common";
import { CRUDServiceOptions } from "common/interfaces/crud.interface";
import type { PaginationResponse } from "common/interfaces/pagination.interface";
import type {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from "typeorm";

export class CRUDService<Entity extends ObjectLiteral, Response> {
  private readonly MAX_RESULTS = 20;
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

  async findAll(
    page: number,
    options?: FindManyOptions<Entity>
  ): Promise<PaginationResponse<ReturnType<typeof this.options.transformObj>>> {
    try {
      const nPage = page + 1;
      const [objs, count] = await this.repository.findAndCount({
        ...options,
        skip: page * this.MAX_RESULTS,
        take: this.MAX_RESULTS,
        order: { id: { direction: "ASC" } } as any,
      });

      const nPages = count / this.MAX_RESULTS;
      const pages = count % this.MAX_RESULTS === 0 ? nPages : Math.floor(nPages) + 1;

      if (nPage <= pages) {
        return {
          info: {
            count,
            pages,
            next: nPage < pages ? (nPage + 1).toString() : null,
            prev: nPage > 0 && nPage ? nPage.toString() : null,
          },
          results: objs.map(this.options.transformObj),
        };
      }
    } catch (error) {
      this.handlerError(error);
    }

    throw new NotFoundException("Page not found");
  }

  async findOneBy(
    where: FindOptionsWhere<Entity> | Array<FindOptionsWhere<Entity>>,
    options?: Omit<FindOneOptions<Entity>, "where">
  ): Promise<ReturnType<typeof this.options.transformObj>> {
    try {
      const obj = await this.repository.findOne({ ...options, where });
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
