import { container, SapphireClient } from '@sapphire/framework';
import type { ClientOptions } from 'discord.js';
import { Config } from '../../config';
import { Types, Utils } from '..';
import { getAllFilesSync } from 'get-all-files';
import { join } from 'path';
import { isClass } from '@sapphire/utilities';
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

	loadServices(folder: string, map: Types.Services): Promise<typeof map> {
		return new Promise<typeof map>(async (res) => {
			for (const filename of getAllFilesSync(folder).toArray()) {
				if (!filename.endsWith('js')) continue;

				const { default: Service } = await import(filename);

				if (!isClass(Service)) continue;

				const instance: Types.BaseService = new Service();
				map.set(instance.name, instance);
				await instance.run();
			}

			res(map);
		});
	}

	override async login(token?: string): Promise<string> {
		let tkn: string = '';

		try {
			container.logger.info(gray('Connecting to discord...'));
			tkn = await super.login(token ?? Utils.envParseString('DISCORD_APP_TOKEN'));
			container.logger.info(green('Connected to discord.'));

			await this.loadServices(join(__dirname, 'services'), this.services);
		} catch (e: any) {
			container.logger.fatal(e);
		}

		return tkn;
	}

	override destroy(): void {
		super.destroy();
		this.services.get<DatabaseService>(Types.Service.DatabaseService).dataSources.forEach((source) => source.destroy());
		return process.exit();
	}
}
