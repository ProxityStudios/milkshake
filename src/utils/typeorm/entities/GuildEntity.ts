import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "guilds" })
export class GuildEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ default: "&" })
  prefix: string;
}
