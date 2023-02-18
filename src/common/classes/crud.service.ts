import { BadRequestException, Logger, NotFoundException } from "@nestjs/common";
import { getUrl } from "../helpers/get-url.helper";
import type { CRUDServiceFindAllOptions, CRUDServiceOptions } from "common/interfaces/crud.interface";
import {
  type DeepPartial,
  type FindOneOptions,
  type FindOptionsWhere,
  ILike,
  In,
  type ObjectLiteral,
  type Repository,
} from "typeorm";
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

  async create(
    entityLike: DeepPartial<Entity> | Array<DeepPartial<Entity>>
  ): Promise<DeepPartial<Entity> | Array<DeepPartial<Entity>> | undefined> {
    try {
      const obj = this.repository.create(entityLike as DeepPartial<Entity>);

      return await this.repository.save(obj);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll(findAllOptions: CRUDServiceFindAllOptions<Entity>): Promise<PaginationResponse<Response>> {
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

      const pages = Math.ceil(count / this.MAX_RESULTS);

      if (page > pages) throw new NotFoundException("Page Not Found");

      return {
        info: {
          count,
          pages,
          next: page < pages ? getUrl({ endpoint: this.options.endpoint, page: page + 1, query: filter }) : null,
          prev: nPage > 0 ? getUrl({ endpoint: this.options.endpoint, page: page - 1, query: filter }) : null,
        },
        results: objs.map(this.options.transformObj),
      };
    } catch (error) {
      throw new NotFoundException("Page Not Found");
    }
  }

  async findOneOrMany(id: number[], options?: Omit<FindOneOptions<Entity>, "where">): Promise<Response | Response[]> {
    try {
      const obj = await (id.length > 1
        ? this.repository.find({ ...options, where: { id: In(id) } as any, order: { id: { direction: "ASC" } } as any })
        : this.repository.findOne({ ...options, where: { id: id[0] } as any }));

      const isObjArray = Array.isArray(obj);

      if (!obj || (isObjArray && obj.length < 1)) throw new NotFoundException("Not Found");

      if (isObjArray) return obj.map(this.options.transformObj);

      return this.options.transformObj(obj);
    } catch (error) {
      throw new NotFoundException("Not Found");
    }
  }

  async removeAll(): Promise<void> {
    const queryBuilder = this.repository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }
}
