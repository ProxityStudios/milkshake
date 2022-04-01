import { container, SapphireClient } from '@sapphire/framework';
import type { ClientOptions } from 'discord.js';
import { Config } from '../../config';
import { Utils } from '..';

export class BaseClient extends SapphireClient {
	readonly config: typeof container.config = Config;

	readonly defaultPrefix = this.config.client.defaultPrefix;
	readonly defaultLanguage = this.config.client.defaultLanguage;

	constructor(options: ClientOptions) {
		super(options);

		container.config = this.config;
	}

	override login(token?: string): Promise<string> {
		return super.login(Utils.envParseString('DISCORD_APP_TOKEN', token));
	}
}
