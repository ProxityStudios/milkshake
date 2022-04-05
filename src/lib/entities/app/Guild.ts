import { Entity, PrimaryColumn, Column } from 'typeorm';
import type { Types } from '../..';

@Entity({
	name: 'guilds'
})
export default class Guild {
	@PrimaryColumn()
	id: string;

	@Column({ nullable: false })
	name: string;

	@Column({ nullable: false })
	prefix: string;

	@Column({ nullable: false })
	language: Types.LanguageStrings;
}
