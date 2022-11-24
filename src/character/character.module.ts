import { Module } from "@nestjs/common";
import { CharacterService } from "./character.service";
import { CharacterController } from "./character.controller";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Character } from "./entities/character.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Character])],
  controllers: [CharacterController],
  providers: [CharacterService, ConfigService],
  exports: [TypeOrmModule, CharacterService],
})
export class CharacterModule {}
