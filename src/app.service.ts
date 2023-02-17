import { Injectable } from "@nestjs/common";
import { getUrl } from "./common/helpers/get-url.helper";
import type { Endpoints } from "common/interfaces";

@Injectable()
export class AppService {
  root(): Partial<Record<Endpoints, string>> {
    return {
      character: getUrl({ endpoint: "character" }),
      location: getUrl({ endpoint: "location" }),
      episode: getUrl({ endpoint: "episode" }),
    };
  }
}
