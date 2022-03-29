import './lib/setup';
import { container, LogLevel } from '@sapphire/framework';
import { BaseClient } from './lib/structures';
import { gray } from 'colorette';
import type { InternationalizationContext } from '@sapphire/plugin-i18next';
import { Config } from './config';

const client = new BaseClient({
	caseInsensitiveCommands: true,
	caseInsensitivePrefixes: true,
	defaultCooldown: {
		delay: 3000
	},
	defaultPrefix: Config.client.defaultPrefix,
	enableLoaderTraceLoggings: process.env.NODE_ENV === 'development' ? true : false,
	intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_TYPING', 'DIRECT_MESSAGES'],
	loadDefaultErrorListeners: false,
	logger: {
		level: process.env.NODE_ENV === 'production' ? LogLevel.Info : LogLevel.Debug
	},
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
	typing: true,
	i18n: {
		defaultLanguageDirectory: 'i18n',
		fetchLanguage: async (context: InternationalizationContext) => {
			if (!context.guild) return container.client.defaultLanguage;

			// const guildSettings = await container.database.findOne(context.guild.id);
			// return guildSettings.language;

			return container.client.defaultLanguage;
		}
	}
});

const main = async () => {
	try {
		client.logger.info(gray('Connecting to discord...'));
		await client.login();
		client.logger.info(gray('Connected to discord.'));
	} catch (error) {
		client.logger.fatal(error);
		client.destroy();
		process.exit(1);
	}
};

main();
