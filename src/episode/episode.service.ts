import { Injectable } from "@nestjs/common";
import { CreateEpisodeDto } from "./dto/create-episode.dto";
import { UpdateEpisodeDto } from "./dto/update-episode.dto";

@Injectable()
export class EpisodeService {
  create(createEpisodeDto: CreateEpisodeDto): string {
    return "This action adds a new episode";
  }

  findAll(): string {
    return `This action returns all episode`;
  }

  findOne(id: number): string {
    return `This action returns a #${id} episode`;
  }

  update(id: number, updateEpisodeDto: UpdateEpisodeDto): string {
    return `This action updates a #${id} episode`;
  }

  remove(id: number): string {
    return `This action removes a #${id} episode`;
  }
}
