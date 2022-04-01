import type { Snowflake } from 'discord.js';
import type { DataSourceOptions } from 'typeorm';
import * as Preconditions from './preconditions';

export * as Preconditions from './preconditions';
export * as Commands from './commands';

declare module '@sapphire/pieces' {
	interface Container {
		config: AppConfig;
	}
}

declare module 'discord.js' {
	interface Client {
		readonly defaultPrefix: string;
		readonly defaultLanguage: Language;
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		[Preconditions.Owner.OwnerOnly]: never;
		[Preconditions.Staff.StaffOnly]: never;
	}
}

export type Language = 'en-US' | 'tr-TR';
export interface AppConfig {
	version: string;
	client: {
		ownerIDs: Snowflake[];
		staffIDs: Snowflake[];
		defaultPrefix: string;
		defaultLanguage: Language;
	};
	dataSources: {
		[key: number]: DataSourceOptions;
	};
}
