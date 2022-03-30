import { Column, Entity, PrimaryColumn } from 'typeorm';
import type { Types } from '../../../..';

@Entity({
	name: 'guilds'
})
export class GuildEntity {
	@PrimaryColumn()
	id!: string;

	@Column({ nullable: false })
	language: Types.Language = 'en-US';
}
