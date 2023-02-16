import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CRUDService } from "../common/classes/crud.service";
import { Episode } from "./entities/episode.entity";
import { transformEpisode } from "./helpers/transform-episode.helper";
import { type FindManyOptions, Repository } from "typeorm";
import type { EpisodeQueryDto } from "./dto/episode-query.dto";
import type { PaginationResponse, EpisodeResponse } from "common/interfaces";

@Injectable()
export class EpisodeService {
  private readonly episodeOptions: FindManyOptions<Episode> = {
    relations: {
      characters: true,
    },
    select: {
      characters: { id: true, uuid: true },
    },
  };

  readonly crud: CRUDService<Episode, EpisodeResponse>;

  constructor(@InjectRepository(Episode) episodeRepository: Repository<Episode>) {
    this.crud = new CRUDService(episodeRepository, {
      loggerName: "EpisodeService",
      transformObj: transformEpisode,
      endpoint: "episode",
    });
  }

  findOneOrMany(id: number[]): Promise<EpisodeResponse | EpisodeResponse[]> {
    return this.crud.findOneOrMany(id, this.episodeOptions);
  }

  findAll(query: EpisodeQueryDto): Promise<PaginationResponse<EpisodeResponse>> {
    return this.crud.findAll({ query, options: this.episodeOptions });
  }
}
