import { container, SapphireClient } from '@sapphire/framework';
import type { ClientOptions } from 'discord.js';
import { Config } from '../../config';
import { Types, Utils } from '..';
import { getAllFilesSync } from 'get-all-files';
import { join } from 'path';
import { isClass } from '@sapphire/utilities';

export class BaseClient extends SapphireClient {
	readonly config: typeof container.config = Config;
	readonly defaultPrefix = this.config.client.defaultPrefix;
	readonly defaultLanguage = this.config.client.defaultLanguage;

	services: typeof container.services = new Map();

	constructor(options: ClientOptions) {
		super(options);

		container.config = this.config;
		container.services = this.services;
	}

	async run() {
		await this.loadServices(join(__dirname, 'services'), this.services);
	}

	loadServices(folder: string, map: Map<Types.BaseService, Types.BaseService>): Promise<typeof map> {
		return new Promise<typeof map>(async (res) => {
			for (const filename of getAllFilesSync(folder).toArray()) {
				if (!filename.endsWith('js')) continue;

				const { default: Service } = await import(filename);

				if (!isClass(Service)) continue;

				const instance: Types.BaseService = new Service();
				await instance.run();
				map.set(instance, instance);
			}

			res(map);
		});
	}

	override async login(token?: string): Promise<string> {
		const str = await super.login(token ?? Utils.envParseString('DISCORD_APP_TOKEN'));
		await this.run();
		return str;
	}

	override destroy(): void {
		super.destroy();
		return process.exit();
	}
}
