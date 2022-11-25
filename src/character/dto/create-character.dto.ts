import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsPositive, IsString, IsUrl } from "class-validator";

export class CreateCharacterDto {
  @IsNumber()
  @IsPositive()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  species: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsNumber()
  @IsPositive()
  originId: number;

  @IsNumber()
  @IsPositive()
  locationId: number;

  @IsString()
  @IsUrl()
  image: string;

  @IsPositive({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  episode: number[];

  @IsString()
  @IsUrl()
  url: string;
}
