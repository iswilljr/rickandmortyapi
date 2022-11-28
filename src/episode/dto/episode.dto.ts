import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "common/dto/pagination.dto";

export class EpisodeDto extends PaginationDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  episode?: string;
}
