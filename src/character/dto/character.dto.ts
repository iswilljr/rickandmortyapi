import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "common/dto/pagination.dto";

export class CharacterDto extends PaginationDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  status?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  species?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  type?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  gender?: string;
}
