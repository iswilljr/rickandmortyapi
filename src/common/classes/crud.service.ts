import { BadRequestException, Logger, NotFoundException } from "@nestjs/common";
import { getUrl } from "common/helpers/get-url.helper";
import { CRUDServiceFindAllOptions, CRUDServiceOptions } from "common/interfaces/crud.interface";
import { DeepPartial, FindOneOptions, FindOptionsWhere, ILike, In, ObjectLiteral, Repository } from "typeorm";
import type { PaginationResponse } from "common/interfaces/pagination.interface";

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
    findAllOptions: CRUDServiceFindAllOptions<Entity>
  ): Promise<PaginationResponse<ReturnType<typeof this.options.transformObj>>> {
    const {
      query: { page = 1, ...filter },
      options,
    } = findAllOptions;

    try {
      const where: FindOptionsWhere<Entity> = {};
      for (const key in filter) {
        const value = filter[key];
        if (typeof value === "string") where[key as keyof Entity] = ILike(`%${value}%`) as any;
      }

      const nPage = page - 1;
      const [objs, count] = await this.repository.findAndCount({
        ...options,
        skip: nPage * this.MAX_RESULTS,
        take: this.MAX_RESULTS,
        order: { id: { direction: "ASC" } } as any,
        where,
      });

      const nPages = count / this.MAX_RESULTS;
      const pages = count % this.MAX_RESULTS === 0 ? nPages : Math.floor(nPages) + 1;
      if (page <= pages) {
        return {
          info: {
            count,
            pages,
            next: page < pages ? getUrl({ endpoint: this.options.endpoint, page: page + 1, query: filter }) : null,
            prev: nPage > 0 ? getUrl({ endpoint: this.options.endpoint, page: page - 1, query: filter }) : null,
          },
          results: objs.map(this.options.transformObj),
        };
      }
    } catch (error) {
      this.handlerError(error);
    }

    throw new NotFoundException("Page not found");
  }

  async findOneOrMany(
    id: number[],
    options?: Omit<FindOneOptions<Entity>, "where">
  ): Promise<ReturnType<typeof this.options.transformObj> | Array<ReturnType<typeof this.options.transformObj>>> {
    try {
      const obj = await (id.length > 1
        ? this.repository.find({ ...options, where: { id: In(id) } as any, order: { id: { direction: "ASC" } } as any })
        : this.repository.findOne({ where: { id: id[0] } as any }));

      const isObjArray = Array.isArray(obj);
      if (obj && isObjArray && obj.length > 0) return obj.map(this.options.transformObj);
      if (obj && !isObjArray) return this.options.transformObj(obj);
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
