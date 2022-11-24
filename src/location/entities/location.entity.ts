import { Character } from "character/entities/character.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Location {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column({
    type: "int",
    unique: true,
  })
  id: number;

  @Column("text")
  name: string;

  @Column("text")
  type: string;

  @Column("text")
  dimension: string;

  @ManyToMany(() => Character, (character) => character.location, { nullable: true })
  residents: Character[];

  @Column("text")
  url: string;

  @Column("date")
  created: string;

  @ManyToMany(() => Character, (character) => character.origin, { nullable: true })
  charactersOrigin: Character[];

  @ManyToMany(() => Character, (character) => character.location, { nullable: true })
  charactersLocation: Character[];
}
