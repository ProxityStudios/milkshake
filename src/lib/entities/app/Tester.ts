import type { Snowflake } from 'discord.js';
import { Entity, PrimaryColumn, Column } from 'typeorm';

import type { Types } from '../..';

@Entity({
	name: 'testers'
})
export default class Tester {
	@PrimaryColumn()
	id: Snowflake;

	@Column({ nullable: false })
	name: string;

	@Column({ nullable: false })
	discriminator: string;

	@Column({ type: 'simple-array', nullable: false })
	roles: Types.Tester.Role[];
}
