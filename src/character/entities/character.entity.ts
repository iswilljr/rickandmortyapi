import { Episode } from "episode/entities/episode.entity";
import { Location } from "location/entities/location.entity";
import { BeforeInsert, Column, Entity, ManyToMany, PrimaryColumn } from "typeorm";

@Entity()
export class Character {
  @PrimaryColumn({
    type: "int",
    unique: true,
  })
  id: number;

  @Column("text")
  name: string;

  @Column("text")
  status: string;

  @Column("text")
  species: string;

  @Column("text")
  type: string;

  @Column("text")
  gender: string;

  @ManyToMany(() => Location, (location) => location.charactersOrigin, { nullable: true })
  origin: Location;

  @ManyToMany(() => Location, (location) => location.charactersLocation, { nullable: true })
  location: Location;

  @Column("text")
  image: string;

  @ManyToMany(() => Episode, (episode) => episode.characters, { nullable: true })
  episode: Episode[];

  @Column("text")
  url: string;

  @Column("date")
  created: string;

  @BeforeInsert()
  beforeInsert(): void {
    this.created = new Date().toISOString();
  }
}
