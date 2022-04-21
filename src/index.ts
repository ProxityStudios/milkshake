import './lib/setup';
import { LogLevel, SapphireClient } from '@sapphire/framework';
import { Stopwatch } from '@sapphire/stopwatch';

const client = new SapphireClient({
	defaultPrefix: '?',
	regexPrefix: /^(hey +)?milkshake[,! ]/i,
	caseInsensitiveCommands: true,
	logger: {
		level: LogLevel.Debug
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

		client.logger.info('Client: Connecting to discord.');

		stopwatch.start();
		await client.login();
		stopwatch.stop();

		client.logger.info(`Client: Connected to discord. ${stopwatch.duration.toFixed(0)}ms`);
	} catch (error) {
		client.logger.fatal(error);
		client.destroy();
		process.exit(1);
	}
};

main();
