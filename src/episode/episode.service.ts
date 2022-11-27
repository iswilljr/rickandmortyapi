import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CRUDService } from "common/classes/crud.service";
import { Episode } from "./entities/episode.entity";
import { transformEpisode } from "./helpers/transform-episode.helper";
import type { Repository } from "typeorm";
import type { EpisodeResponse } from "common/interfaces/episode.interface";

@Injectable()
export class EpisodeService extends CRUDService<Episode, EpisodeResponse> {
  constructor(@InjectRepository(Episode) episodeRepository: Repository<Episode>) {
    super(episodeRepository, {
      loggerName: "EpisodeService",
      transformObj: transformEpisode,
      endpoint: "episode",
    });
  }
}
