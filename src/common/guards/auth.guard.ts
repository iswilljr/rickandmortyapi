import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import type { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    const token = req.headers.authorization;

    if (!token) return false;

    const isValidToken = await bcrypt.compare(token, this.configService.get("TOKEN"));

    return isValidToken;
  }
}
