import { getIdFromURL } from "./get-id-from-url";

export function sortById(a: string, b: string): number {
  return getIdFromURL(a) - getIdFromURL(b);
}
