import { container, SapphireClient } from '@sapphire/framework';
import type { ClientOptions } from 'discord.js';
import { Config } from '../../config';
import { Utils, DatabaseService } from '..';
import { gray, green } from 'colorette';

export default class BaseClient extends SapphireClient {
	readonly config: typeof container.config = Config;
	readonly utils: typeof container.utils = Utils;
	readonly services: typeof container.services = new Map();

	readonly defaultPrefix = this.config.client.defaultPrefix;
	readonly defaultLanguage = this.config.client.defaultLanguage;

	constructor(options: ClientOptions) {
		super(options);

		container.config = this.config;
		container.services = this.services;
		container.utils = this.utils;
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
		const db = new DatabaseService();
		container.services.set(db.name, db);
		return db.run();
	}

	override login(token?: string): Promise<string> {
		return super.login(this.utils.envParseString('DISCORD_APP_TOKEN', token));
	}
}
