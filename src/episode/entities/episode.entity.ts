import { Character } from "character/entities/character.entity";
import { Column, Entity, ManyToMany, PrimaryColumn } from "typeorm";

@Entity()
export class Episode {
  @PrimaryColumn({
    type: "int",
    unique: true,
  })
  id: number;

  @Column("text")
  name: string;

  @Column("date")
  air_date: string;

  @Column("text")
  episode: string;

  @ManyToMany(() => Character)
  characters: Character[];

  @Column("text")
  url: string;

  @Column("date")
  created: string;
}
