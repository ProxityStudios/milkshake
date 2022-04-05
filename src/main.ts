import './lib/setup';

import { container, LogLevel } from '@sapphire/framework';
import { gray, green } from 'colorette';
import { Intents } from 'discord.js';
import glob from 'glob';

import { Config } from './config';
import { AppGuildEntity, BaseClient, DatabaseService, Types, Utils } from './lib';

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
			enabled: Config.dev ? true : false
		},
		i18next: {
			debug: Config.dev ? true : false,
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
		fetchLanguage: async (context): Promise<Types.LanguageStrings> => {
			const { defaultLanguage } = container.config.client;

			if (!context.guild) return defaultLanguage;

			const appDataManager = container.services.get<DatabaseService>('DATABASE').dataSources.app.manager;
			const savedGuild = await appDataManager.findOneBy(AppGuildEntity, { id: context.guild.id });

			if (!savedGuild) return defaultLanguage;

			return savedGuild.language;
		}
	},
	fetchPrefix: async (message) => {
		const { defaultPrefix } = container.config.client;

		if (!message.guild) return defaultPrefix;

		const appDataManager = container.services.get<DatabaseService>('DATABASE').dataSources.app.manager;
		const savedGuild = await appDataManager.findOneBy(AppGuildEntity, { id: message.guild.id });

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
