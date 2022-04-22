declare module '@sapphire/pieces' {
	interface Container {}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		BotOwner: never;
	}
}

declare module 'discord.js' {
	interface Client {}
}

export type Snowflake = `${bigint}`;
