import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

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
  @IsNotEmpty()
  image: string;

  @IsPositive({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  episode: number[];

  @IsString()
  @IsNotEmpty()
  url: string;
}
