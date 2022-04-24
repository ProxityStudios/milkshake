import type { IConfig } from './Config';

declare module '@sapphire/pieces' {
	interface Container {
		config: IConfig;
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		BotOwner: never;
	}
}

declare module 'discord.js' {
	interface Client {
		config: IConfig;
	}
}
