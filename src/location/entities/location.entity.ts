import { Character } from "character/entities/character.entity";
import { Column, Entity, ManyToMany, PrimaryColumn } from "typeorm";

@Entity()
export class Location {
  @PrimaryColumn({
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
  residents: Character;

  @Column("text")
  url: string;

  @Column("date")
  created: string;

  @ManyToMany(() => Character, (character) => character.origin, { nullable: true })
  charactersOrigin: Character[];

  @ManyToMany(() => Character, (character) => character.location, { nullable: true })
  charactersLocation: Character[];
}
