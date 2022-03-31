import { container, SapphireClient } from '@sapphire/framework';
import type { ClientOptions } from 'discord.js';
import { Config } from '../../config';
import { Types, Utils } from '..';
import { join } from 'path';
import { gray, green } from 'colorette';
import type { DatabaseService } from './services';

export class BaseClient extends SapphireClient {
	readonly config: typeof container.config = Config;
	readonly defaultPrefix = this.config.client.defaultPrefix;
	readonly defaultLanguage = this.config.client.defaultLanguage;

	services: Types.Services = new Map();

	constructor(options: ClientOptions) {
		super(options);

		container.config = this.config;
		container.services = this.services;
	}

	override async login(token?: string): Promise<string> {
		container.logger.info(gray('Connecting to discord...'));
		const tkn = await super.login(token ?? Utils.envParseString('DISCORD_APP_TOKEN'));
		container.logger.info(green('Connected to discord.'));

		container.logger.info(gray('Services loading...'));
		await Utils.loadServices(join(__dirname, 'services'), this.services);
		container.logger.info(green('Services loaded.'));
		return tkn;
	}

	override destroy(): void {
		super.destroy();
		this.services.get<DatabaseService>(Types.Service.DatabaseService)?.dataSources.forEach((source) => source.destroy());
		return process.exit();
	}
}
