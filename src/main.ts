import './lib/setup';

import { LogLevel } from '@sapphire/framework';
import { BaseClient } from './lib/structures';
import { gray, green } from 'colorette';
import { Intents } from 'discord.js';
import { Config } from './config';
import { Types, Utils } from './lib';

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
		defaultLanguageDirectory: 'i18n',
		fetchLanguage: (): Types.Language => 'en-US' // TODO: fetch from the database
	},
	fetchPrefix: () => '?' // TODO: fetch from the database
});

const main = async () => {
	try {
		client.logger.info(gray('Starting the client...'));

		client.logger.info(gray('Connecting to discord...'));
		await client.login();
		client.logger.info(green('Connected to discord.'));

		client.logger.info(green('All things are done.'));
	} catch (e) {
		client.logger.fatal(e);
		void client.destroy();
	}
};

main();
