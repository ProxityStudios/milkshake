import { container, SapphireClient } from '@sapphire/framework';
import type { ClientOptions } from 'discord.js';
import { Config } from '../../config';
import { Utils, DatabaseService, CacheService } from '..';
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
		await this.initServices();

		this.logger.info(gray('Connecting to discord...'));
		await this.login();
		this.logger.info(green('Connected to discord.'));

		this.logger.info(gray('CacheService: Caching saved guilds...'));
		await this.cacheSavedGuilds();
		this.logger.info(gray('CacheService: All saved guilds cached.'));

		if (this.config.dev) {
			this.logger.info(this.services.get<CacheService>('CACHE').guilds);
		}
	}

	private cacheSavedGuilds(): Promise<any[]> {
		const promises: Promise<any>[] = [];
		const guilds = this.guilds.cache.map((g) => g);

		for (const guild of guilds) {
			promises.push(this.services.get<CacheService>('CACHE').cacheGuild(guild.id));
		}

		return Promise.all(promises);
	}

	/**
	 * TODO: add automation to load services
	 */
	private initServices(): Promise<any[]> {
		const promises: Promise<any>[] = [];

		const db = new DatabaseService();
		container.services.set(db.name, db);
		promises.push(db.run());

		const cache = new CacheService();
		container.services.set(cache.name, cache);
		promises.push(cache.run());

		return Promise.all(promises);
	}

	override login(token?: string): Promise<string> {
		return super.login(this.utils.envParseString('DISCORD_APP_TOKEN', token));
	}
}
