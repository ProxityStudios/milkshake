import { container } from '@sapphire/framework';
import { gray, green } from 'colorette';
import { Types } from '../..';
import type DatabaseService from './DatabaseService';

// fix awaiting
export default class CacheService extends Types.BaseService {
	app: Types.CacheServiceAppDataSource = {
		guilds: new Map()
	};

	private appRepos = container.services.get<DatabaseService>(Types.Service.DatabaseService)?.repos[0];

	constructor() {
		super(Types.Service.CacheService, {
			priority: Types.Priority.Low,
			disabled: true
		});
	}

	async run() {
		container.logger.info(gray('Saved guilds are caching...'));
		await this.cacheGuilds(container.client.guilds.cache);
		container.logger.info(green('Saved guilds are cached'));
	}

	private cacheGuilds(guildCollection: typeof container.client.guilds.cache) {
		return new Promise(async (res) => {
			// let cachedGuildCount: number = 0;

			for await (const [id] of guildCollection) {
				const savedGuild = await this.appRepos?.guilds?.findOneBy({
					id
				});

				if (!savedGuild) continue;

				this.app.guilds.set(id, savedGuild);
				// cachedGuildCount++;
			}

			res(this.app.guilds);
		});
	}
}
