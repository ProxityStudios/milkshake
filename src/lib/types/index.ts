import type { Snowflake } from 'discord.js';
import type { DataSourceOptions } from 'typeorm';
import type * as Service from './service';
import * as Preconditions from './preconditions';
import type { BaseService } from '../structures/BaseService';

export * as Preconditions from './preconditions';
export * as Service from './service';
export * as Commands from './commands';
export * as Database from './database';

declare module '@sapphire/pieces' {
	interface Container {
		config: AppConfig;
		services: ExtendedMap<Service.Name, BaseService>;
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

export type Language =
	| 'af'
	| 'ar'
	| 'ca'
	| 'cs'
	| 'da'
	| 'en'
	| 'es-ES'
	| 'fi'
	| 'fr'
	| 'he'
	| 'hu'
	| 'it'
	| 'ja'
	| 'ko'
	| 'nl'
	| 'no'
	| 'pl'
	| 'pt-BR'
	| 'pt-PT'
	| 'ro'
	| 'ru'
	| 'sr'
	| 'sv-SE'
	| 'tr'
	| 'uk'
	| 'vi'
	| 'zh-CN'
	| 'zh-TW';
	
export interface AppConfig {
	version: string;
	client: {
		ownerIDs: Snowflake[];
		staffIDs: Snowflake[];
		defaultPrefix: string;
		defaultLanguage: Language;
	};
	dataSources: {
		app: DataSourceOptions;
	};
}
