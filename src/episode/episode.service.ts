import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CRUDService } from "common/classes/crud.service";
import { Episode } from "./entities/episode.entity";

@Injectable()
export class EpisodeService extends CRUDService<Episode> {
  constructor(@InjectRepository(Episode) episodeRepository: Repository<Episode>) {
    super(episodeRepository, "EpisodeService");
  }
}
