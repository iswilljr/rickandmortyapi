import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

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

  // @IsString()
  // @IsNotEmpty()
  // origin: Location;

  // @IsString()
  // @IsNotEmpty()
  // location: Location;

  @IsString()
  @IsNotEmpty()
  image: string;

  // @IsString()
  // @IsNotEmpty()
  // episode: string;

  @IsString()
  @IsNotEmpty()
  url: string;
}
