import { gray } from 'colorette';
import type { Snowflake } from 'discord.js';
import { AppGuildEntity, DatabaseService } from '..';
import BaseService from '../structures/BaseService';

export default class Cache extends BaseService {
	guilds = new Map<Snowflake, AppGuildEntity>();

	constructor() {
		super('CACHE');
	}

	async run() {
		this.container.logger.info(gray('CacheService: Initialized.'));
	}

	async cacheGuild(id: Snowflake, returnIfExists: boolean = true): Promise<AppGuildEntity> {
		const appDataSource = this.container.services.get<DatabaseService>('DATABASE').dataSources.app.manager;
		const savedGuild = await appDataSource.findOneBy(AppGuildEntity, {
			id
		});

		if (!savedGuild) throw gray('CacheService: Guild not found in database: ') + id;

		const isCached = this.guilds.get(id);

		if (isCached && returnIfExists) {
			return isCached;
		}

		const cachedGuild = this.guilds.set(id, savedGuild).get(id)!;
		this.container.logger.info(gray('CacheService: Guild cached:'), id);

		return cachedGuild;
	}

	flushCachedGuild(id: Snowflake): boolean {
		const isCached = this.guilds.get(id);

		if (isCached) {
			return this.guilds.delete(id);
		} else {
			return true;
		}
	}
}
