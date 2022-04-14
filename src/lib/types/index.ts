import type { CooldownOptions } from '@sapphire/framework';
import type { Colorette } from 'colorette';
import { Collection, Snowflake } from 'discord.js';
import type { DataSourceOptions } from 'typeorm';

import type { Types, Utils } from '..';
import type BaseSlashCreator from '../structures/BaseSlashCreator';
export * as Preconditions from './preconditions';
export * as Service from './service';
export * as Commands from './commands';
export * as Database from './database';
export * as Tester from './tester';

declare module '@sapphire/pieces' {
	interface Container {
		config: Config;
		services: ServiceRegistry;
		utils: typeof Utils;
		colorette: Colorette;
		slashCreator: BaseSlashCreator;
	}
}

declare module 'discord.js' {
	interface Client {
		readonly defaultPrefix: string;
		readonly defaultLanguage: LanguageStrings;
		readonly colorette: Colorette;
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		OwnerOnly: never;
		StaffOnly: never;
		BetaTesterOnly: never;
	}
}

export class ServiceRegistry extends Collection<Types.Service.Key, Types.Service.Value> {}

export interface ServiceRegistry {
	get<K extends Types.Service.Key>(key: K): Types.Service.Names[K];
	get(key: string): undefined;
	has(key: Types.Service.Key): true;
	has(key: string): false;
}

export type Enum<E> = Record<keyof E, number | string> & { [k: number]: keyof E };

// export type Language = 'en-US' | 'tr-TR' | 'uk-UA';

export enum Language {
	'en-US',
	'tr-TR',
	'uk-UA'
}

export type LanguageStrings = keyof typeof Language;

export interface Config {
	version: string;
	dev: boolean;
	client: {
		ownerIDs: Snowflake[];
		staffIDs: Snowflake[];
		defaultPrefix: string;
		defaultLanguage: LanguageStrings;
		defaultCooldown: CooldownOptions;
		testerGuilds: Snowflake[];
		i18n: {
			defaultLanguageDirectory: string;
		};
	};
	dataSources: {
		app: DataSourceOptions;
	};
}
