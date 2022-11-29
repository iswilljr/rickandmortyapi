import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "common/dto/pagination.dto";

export class LocationQueryDto extends PaginationDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  dimension?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  type?: string;
}
