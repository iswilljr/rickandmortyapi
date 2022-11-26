import { Episode } from "episode/entities/episode.entity";
import { Location } from "location/entities/location.entity";
import { BeforeInsert, Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Character {
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
  status: string;

  @Column("text")
  species: string;

  @Column("text")
  type: string;

  @Column("text")
  gender: string;

  @ManyToOne(() => Location, (location) => location.charactersOrigin, { nullable: true, onDelete: "CASCADE" })
  origin: Location;

  @ManyToOne(() => Location, (location) => location.residents, { nullable: true, onDelete: "CASCADE" })
  location: Location;

  @Column("text")
  image: string;

  @ManyToMany(() => Episode, (episode) => episode.characters, { nullable: true, onDelete: "CASCADE" })
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
