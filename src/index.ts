import './lib/setup';
import { container, LogLevel } from '@sapphire/framework';
import { BaseClient } from './lib/structures';
import { gray, green } from 'colorette';
import type { InternationalizationContext } from '@sapphire/plugin-i18next';
import { Config } from './config';
import { Types } from './lib';
import type { DatabaseService } from './lib/structures/services';

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

			const guildSettings = await container.services
				.get<DatabaseService>(Types.Service.DatabaseService)
				.repos[0].guilds?.findOneBy({ id: context.guild.id });

			return guildSettings?.language ?? container.client.defaultLanguage;
		}
	}
});

const main = async () => {
	try {
		client.logger.info(gray('Starting the client...'));
		await client.login();
		client.logger.info(green('All things are done.'));
	} catch (error) {
		client.logger.fatal(error);
		client.destroy();
		process.exit(1);
	}
};

main();
