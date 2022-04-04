import type { Snowflake } from 'discord.js';
import type { DataSourceOptions } from 'typeorm';
import type * as Service from './service';
import * as Preconditions from './preconditions';
import type BaseService from '../structures/BaseService';
import type { Utils } from '..';

export * as Preconditions from './preconditions';
export * as Service from './service';
export * as Commands from './commands';
export * as Database from './database';

declare module '@sapphire/pieces' {
	interface Container {
		config: AppConfig;
		services: ExtendedMap<Service.Name, BaseService>;
		utils: typeof Utils;
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

declare class ExtendedMap<V = any, T = any> extends Map {
	get<K extends T>(name: V): K;
}

export type Language = 'en-US' | 'tr-TR' | 'uk-UA';

export interface AppConfig {
	version: string;
	dev: boolean;
	client: {
		ownerIDs: Snowflake[];
		staffIDs: Snowflake[];
		defaultPrefix: string;
		defaultLanguage: Language;
		i18n: {
			defaultLanguageDirectory: string;
		};
	};
	dataSources: {
		app: DataSourceOptions;
	};
}
