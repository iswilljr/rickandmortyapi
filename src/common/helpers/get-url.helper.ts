import type { Endpoints } from "common/interfaces";

interface GetUrlOptions {
  endpoint: Endpoints;
  id?: string | number;
  page?: number;
  query?: Record<string, string | undefined>;
}

const removeLastSlash = (str: string): string => str.replace(/\/$/, "");

export function getUrl({ endpoint, id, page, query }: GetUrlOptions): string {
  const url = new URL(removeLastSlash(`/api/${endpoint}/${id ?? ""}`), removeLastSlash(process.env.BASE_URL as string));

  const searchParams = Object.assign({}, query ?? {}, { page });

  for (const key in searchParams) {
    const value = searchParams[key];
    if (value !== undefined) url.searchParams.set(key, value);
  }

  return url.toString();
}
