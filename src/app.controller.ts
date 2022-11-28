import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import type { Endpoints } from "common/interfaces";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  root(): Partial<Record<Endpoints, string>> {
    return this.appService.root();
  }
}
