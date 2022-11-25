import { ArrayNotEmpty, IsArray, IsDate, IsNotEmpty, IsNumber, IsPositive, IsString, IsUrl } from "class-validator";

export class CreateEpisodeDto {
  @IsNumber()
  @IsPositive()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsDate()
  air_date: string;

  @IsString()
  @IsNotEmpty()
  episode: string;

  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  characters: string[];

  @IsString()
  @IsUrl()
  url: string;
}
