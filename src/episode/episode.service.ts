import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CRUDService } from "common/classes/crud.service";
import { Episode } from "./entities/episode.entity";
import { EpisodeResponse } from "common/interfaces/episode.interface";
import { transformEpisode } from "./helpers/transform-episode.helper";

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
