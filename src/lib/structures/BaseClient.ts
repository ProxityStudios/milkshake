import { container, SapphireClient } from '@sapphire/framework';
import type { ClientOptions } from 'discord.js';
import { Config } from '../../config';
import { Utils } from '..';
import { Database } from '../services/Database';
import { gray, green } from 'colorette';

export class BaseClient extends SapphireClient {
	readonly config: typeof container.config = Config;

	readonly defaultPrefix = this.config.client.defaultPrefix;
	readonly defaultLanguage = this.config.client.defaultLanguage;

	constructor(options: ClientOptions) {
		super(options);

		container.config = this.config;
		container.services = new Map();
	}

	async run() {
		await this.initDatabaseService();

		this.logger.info(gray('Connecting to discord...'));
		await this.login();
		this.logger.info(green('Connected to discord.'));
	}

	/**
	 * TODO: add automation to load services
	 */
	private initDatabaseService() {
		const DatabaseService = new Database();
		container.services.set(DatabaseService.name, DatabaseService);
		return DatabaseService.run();
	}

	override login(token?: string): Promise<string> {
		return super.login(Utils.envParseString('DISCORD_APP_TOKEN', token));
	}
}
