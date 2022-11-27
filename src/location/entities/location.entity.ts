import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Character } from "character/entities/character.entity";

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

  @Column("timestamp")
  created: string;

  @OneToMany(() => Character, (character) => character.origin, { nullable: true, onDelete: "CASCADE" })
  charactersOrigin: Character[];
}
