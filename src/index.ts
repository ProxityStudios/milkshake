import './lib/setup';
import { LogLevel } from '@sapphire/framework';
import { Stopwatch } from '@sapphire/stopwatch';
import { MilkshakeClient } from './lib/structures/MilkshakeClient';
import { Config } from './config';

const client = new MilkshakeClient({
	defaultPrefix: Config.client.defaultPrefix,
	regexPrefix: Config.client.regexPrefix,
	caseInsensitiveCommands: true,
	caseInsensitivePrefixes: true,
	loadMessageCommandListeners: true,
	logger: {
		level: Config.mode === 'development' ? LogLevel.Debug : LogLevel.Info
	},
	shards: 'auto',
	intents: [
		'GUILDS',
		'GUILD_MEMBERS',
		'GUILD_BANS',
		'GUILD_EMOJIS_AND_STICKERS',
		'GUILD_VOICE_STATES',
		'GUILD_MESSAGES',
		'GUILD_MESSAGE_REACTIONS',
		'DIRECT_MESSAGES',
		'DIRECT_MESSAGE_REACTIONS'
	]
});

const main = async () => {
	try {
		const stopwatch = new Stopwatch();

		client.logger.info('Client: Starting...');

		stopwatch.start();
		await client.start();
		stopwatch.stop();

		client.logger.info(`Client: Done. /${stopwatch.duration.toFixed(0)}ms/`);
	} catch (error) {
		client.logger.fatal(error);
		client.destroy();
		process.exit(1);
	}
};

main();
