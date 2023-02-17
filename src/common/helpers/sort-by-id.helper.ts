import { getIdFromURL } from "./get-id-from-url.helper";

export function sortById(a: string, b: string): number {
  return getIdFromURL(a) - getIdFromURL(b);
}
