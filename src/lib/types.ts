import type { Config } from '../config';

declare module '@sapphire/pieces' {
	interface Container {
		config: typeof Config;
		services: Map<BaseService, BaseService>;
	}
}

declare module 'discord.js' {
	interface Client {
		readonly defaultPrefix: string;
		readonly defaultLanguage: Languages;

		loadServices(folder: string, map: Map<BaseService, BaseService>): Promise<Map<BaseService, BaseService>>;
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

export type Languages = 'en-US';

export abstract class BaseService {
	abstract run(): void | any;
}
