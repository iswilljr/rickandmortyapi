import { Character } from "character/entities/character.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

  @OneToMany(() => Character, (character) => character.location, { nullable: true, onDelete: "CASCADE" })
  residents: Character[];

  @Column("text")
  url: string;

  @Column("date")
  created: string;

  @OneToMany(() => Character, (character) => character.origin, { nullable: true, onDelete: "CASCADE" })
  charactersOrigin: Character[];
}
