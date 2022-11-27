import { Endpoints } from "common/interfaces";

interface GetUrlOptions {
  enpoint: Endpoints;
  id?: number;
  page?: number;
}

const removeLastSlash = (str: string): string => str.replace(/\/$/, "");

export const getUrl = ({ enpoint, id, page }: GetUrlOptions): string => {
  const url = new URL(removeLastSlash(`/api/${enpoint}/${id ?? ""}`), removeLastSlash(process.env.BASE_URL));

  if (page) url.searchParams.set("page", page.toString());

  return url.toString();
};
