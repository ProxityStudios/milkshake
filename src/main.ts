import './lib/setup';

import { container, LogLevel } from '@sapphire/framework';
import { bgBlackBright, bgGreenBright } from 'colorette';
import { Intents } from 'discord.js';
import * as glob from 'glob';

import { Config } from './config';
import { BaseClient, Types } from './lib';

const client = new BaseClient({
	intents: new Intents([Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILDS]),
	logger: {
		depth: 2,
		level: LogLevel.Debug
	},
	restTimeOffset: 0,
	defaultCooldown: Config.client.defaultCooldown,
	defaultPrefix: Config.client.defaultPrefix,
	enableLoaderTraceLoggings: Config.dev,
	loadDefaultErrorListeners: true,
	loadMessageCommandListeners: true,
	caseInsensitiveCommands: true,
	typing: true,
	i18n: {
		hmr: {
			enabled: Config.dev
		},
		i18next: {
			debug: false,
			fallbackNS: 'common',
			defaultNS: 'common',
			returnObjects: true,
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

			const savedGuild = await container.services.get('database').repos.app.guilds.findOneBy({ id: context.guild.id });
			if (!savedGuild) return defaultLanguage;

			return savedGuild.language;
		}
	},
	fetchPrefix: async (message) => {
		const defaultPrefix = message.client.defaultPrefix;

		if (!message.guild) return defaultPrefix;

		const savedGuild = await container.services.get('database').repos.app.guilds.findOneBy({ id: message.guild.id });
		if (!savedGuild) return defaultPrefix;

		return savedGuild.prefix;
	}
});

const main = async () => {
	if (Config.dev) {
		client.logger.warn(client.colorette.bgRedBright('-------> STARTING IN DEVELOPMENT MODE <-------'));
	}

	try {
		client.logger.info(bgBlackBright('Starting the client...'));
		await client.run();
		client.logger.info(bgGreenBright('All things are done.'));
	} catch (e) {
		client.logger.fatal(e);
		void client.destroy();
	}
};

main();
