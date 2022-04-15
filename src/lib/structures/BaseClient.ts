import { container, SapphireClient } from '@sapphire/framework';
import type { ClientOptions } from 'discord.js';

import { Config } from '../../config';
import { Utils, DatabaseService, CacheService } from '..';
import { ServiceRegistry } from '../types';

export default class BaseClient extends SapphireClient {
	readonly config: typeof container.config = Config;
	readonly colorette = container.colorette;
	readonly utils: typeof container.utils = Utils;
	readonly defaultPrefix = this.config.client.defaultPrefix;
	readonly defaultLanguage = this.config.client.defaultLanguage;

	// add to <container.store> registry
	readonly services: typeof container.services = new ServiceRegistry();

	constructor(options: ClientOptions) {
		super(options);

		container.config = this.config;
		container.services = this.services;
		container.utils = this.utils;
	}

	async run(): Promise<void> {
		this.logger.info(this.colorette.gray('Initializing services...'));
		await this.initServices();

		this.logger.info(this.colorette.gray('CacheService: Caching saved guilds and testers...'));
		await this.cacheSavedGuilds();
		await this.cacheSavedTesters();
		this.logger.info(this.colorette.green('CacheService: Saved testers and guilds are cached.'));

		this.logger.info(this.colorette.gray('Connecting to discord...'));
		await this.login();
		this.logger.info(this.colorette.green('Connected to discord.'));

		if (this.config.dev) {
			this.logger.debug(this.services.get('cache').guilds);
			this.logger.debug(this.services.get('cache').testers);
		}
	}

	// make in cache service
	private async cacheSavedGuilds(): Promise<void> {
		const guilds = await this.services.get('database').repos.app.guilds.find();

		for await (const guild of guilds) {
			this.services.get('cache').cacheGuild(guild);
		}
	}

	// make in cache service
	private async cacheSavedTesters(): Promise<void> {
		const testers = await this.services.get('database').repos.app.testers.find();

		for await (const tester of testers) {
			this.services.get('cache').cacheTester(tester);
		}
	}

	// add automation to load services
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
