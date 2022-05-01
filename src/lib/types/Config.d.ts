import type { Snowflake } from 'discord.js';

export interface IConfig {
	mode: Mode;
	client: Client;
}

export type Mode = 'development' | 'production';

export interface Client {
	ownerIDs: Snowflake[];
	defaultPrefix: string;
	regexPrefix: RegExp;
}
