import './lib/setup';

import { container, LogLevel } from '@sapphire/framework';
import { BaseClient } from './lib/structures';
import { gray, green } from 'colorette';
import { Intents } from 'discord.js';
import { Config } from './config';
import { Types, Utils } from './lib';
import type { Database } from './lib/services/Database';
import { Guild } from './lib/entities/app/Guild';
import glob from 'glob';

const APP_MODE = Utils.envParseString('NODE_ENV', 'development');

const client = new BaseClient({
	restTimeOffset: 0,
	intents: new Intents([Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILDS]),
	caseInsensitiveCommands: true,
	logger: {
		depth: 2,
		level: LogLevel.Debug
	},
	defaultCooldown: {
		delay: 3000
	},
	loadDefaultErrorListeners: true,
	enableLoaderTraceLoggings: APP_MODE === 'development' ? true : false,
	typing: true,
	defaultPrefix: Config.client.defaultPrefix,
	i18n: {
		hmr: {
			enabled: true
		},
		i18next: {
			debug: true,
			ns: glob.sync(`${Config.client.i18n.defaultLanguageDirectory}/${Config.client.defaultLanguage}/**/*.json`).map((file) => {
				const ns = file.split('/').slice(-3);

				if (ns[0] === 'i18n') {
					const [_1, _2, ...rest] = ns;
					return rest[0].replace('.json', '');
				}

				return ns[0] + '/' + ns[1] + '/' + ns[2].replace('.json', '');
			}),
			backend: {
				loadPath: (lang: string, ns: string) => `${Config.client.i18n.defaultLanguageDirectory}/${lang}/${ns}.json`
			}
		},
		defaultLanguageDirectory: Config.client.i18n.defaultLanguageDirectory,
		fetchLanguage: async (context): Promise<Types.Language> => {
			const { defaultLanguage } = container.config.client;

			if (!context.guild) return defaultLanguage;

			const appDataManager = container.services.get<Database>('DATABASE').dataSources.app.manager;
			const savedGuild = await appDataManager.findOneBy(Guild, { id: context.guild.id });

			if (!savedGuild) return defaultLanguage;

			return savedGuild.language;
		}
	},
	fetchPrefix: async (message) => {
		const { defaultPrefix } = container.config.client;

		if (!message.guild) return defaultPrefix;

		const appDataManager = container.services.get<Database>('DATABASE').dataSources.app.manager;
		const savedGuild = await appDataManager.findOneBy(Guild, { id: message.guildId! });

		if (!savedGuild) return defaultPrefix;

		return savedGuild.prefix;
	}
});

const main = async () => {
	try {
		client.logger.info(gray('Starting the client...'));
		await client.run();
		client.logger.info(green('All things are done.'));
	} catch (e) {
		client.logger.fatal(e);
		void client.destroy();
	}
};

main();
