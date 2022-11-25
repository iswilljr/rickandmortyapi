import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsPositive, IsString, IsUrl } from "class-validator";

export class CreateLocationDto {
  @IsNumber()
  @IsPositive()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  dimension: string;

  @IsPositive({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  residents: number[];

  @IsString()
  @IsUrl()
  url: string;
}
