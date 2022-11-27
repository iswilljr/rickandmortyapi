export interface CreateCharacterDto {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  originId: number;
  locationId: number;
  image: string;
  episode: number[];
  url: string;
}
