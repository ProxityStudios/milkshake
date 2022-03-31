import type { Repository } from 'typeorm';
import type { Config } from '../config';
import type { Database } from '.';

declare module '@sapphire/pieces' {
	interface Container {
		config: typeof Config;
		services: Services;
	}
}

declare module 'discord.js' {
	interface Client {
		readonly defaultPrefix: string;
		readonly defaultLanguage: Language;
	}
}

export enum CoreCategoryCommand {
	Ping = 'ping'
}

export enum OwnerCategoryCommand {
	Eval = 'eval',
	Shutdown = 'shutdown'
}

export enum StaffCategoryCommand {
	Example = 'example'
}

export enum AdminCategoryCommand {
	Language = 'language'
}

export enum Precondition {
	OwnerOnly = 'OwnerOnly',
	StaffOnly = 'StaffOnly'
}

declare module '@sapphire/framework' {
	interface Preconditions {
		[Precondition.OwnerOnly]: never;
		[Precondition.StaffOnly]: never;
	}
}

export type Language = 'en-US' | 'tr-TR';

export interface BaseServiceOptions {
	priority: Priority;
	disabled?: boolean;
}

export enum Priority {
	High = 1,
	Normal = 0,
	Low = -1
}

export abstract class BaseService {
	constructor(
		public name: Service,
		private serviceOptions: BaseServiceOptions = {
			priority: Priority.Normal,
			disabled: false
		}
	) {}

	/**
	 * Run function.
	 */
	abstract run(): void | any;

	/**
	 * Get service options.
	 */
	get options(): BaseServiceOptions {
		return this.serviceOptions;
	}
}

export enum DataSource {
	AppDataSource = 'AppDataSource'
}

export interface Repositories {
	0: AppDataSource;
}

export interface AppDataSource {
	guilds: Repository<Database.AppDataSource.GuildEntity> | null;
}

export type Services = ServiceMap;

export enum Service {
	DatabaseService = 'DatabaseService',
	CacheService = 'CacheService'
}

export interface CacheServiceAppDataSource {
	guilds: Map<string, Database.AppDataSource.GuildEntity>;
}

declare class ServiceMap<V = Service, T = BaseService> extends Map {
	get<K extends T>(name: V): K | null;
}
