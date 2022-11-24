import { Module } from "@nestjs/common";
import { CharacterService } from "./character.service";
import { CharacterController } from "./character.controller";
import { ConfigService } from "@nestjs/config";

@Module({
  controllers: [CharacterController],
  providers: [CharacterService, ConfigService],
})
export class CharacterModule {}
