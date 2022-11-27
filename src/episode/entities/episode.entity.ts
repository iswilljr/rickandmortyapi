import { Character } from "character/entities/character.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Episode {
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
  air_date: string;

  @Column("text")
  episode: string;

  @ManyToMany(() => Character, (character) => character.episode, { nullable: true, onDelete: "CASCADE" })
  @JoinTable()
  characters: Character[];

  @Column("text")
  url: string;

  @Column("timestamp")
  created: string;
}
