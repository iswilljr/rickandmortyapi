export function getIdFromURL(url: string): number {
  return Number(url.split("/").pop());
}
