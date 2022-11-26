import { Character } from "character/entities/character.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

  @ManyToOne(() => Character, (character) => character.location, { nullable: true })
  residents: Character[];

  @Column("text")
  url: string;

  @Column("date")
  created: string;

  @ManyToMany(() => Character, (character) => character.origin, { nullable: true })
  @JoinTable()
  charactersOrigin: Character[];
}
