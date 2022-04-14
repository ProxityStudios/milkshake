import { Collection, Snowflake } from 'discord.js';

import type { AppGuildEntity, AppTesterEntity } from '..';
import BaseService from '../structures/BaseService';

export default class Cache extends BaseService {
	guilds = new Collection<Snowflake, AppGuildEntity>();
	testers = new Collection<Snowflake, AppTesterEntity>();

	constructor() {
		super('cache');
	}

	async run(): Promise<void> {
		this.container.logger.info(this.container.colorette.green('CacheService: Initialized.'));
	}

	cacheGuild(guild: AppGuildEntity, returnIfExists: boolean = true): AppGuildEntity {
		const isCached = this.guilds.get(guild.id);

		if (isCached && returnIfExists) {
			return isCached;
		}

		const cachedGuild = this.guilds.set(guild.id, guild).get(guild.id)!;
		this.container.logger.info(this.container.colorette.cyan('CacheService: Guild cached:'), guild.id);

		return cachedGuild;
	}

	flushCachedGuild(id: Snowflake): boolean {
		return this.guilds.has(id) ?? this.guilds.delete(id);
	}

	cacheTester(tester: AppTesterEntity, returnIfExists: boolean = true): AppTesterEntity {
		const isCached = this.testers.get(tester.id);

		if (isCached && returnIfExists) {
			return isCached;
		}

		const cachedTester = this.testers.set(tester.id, tester).get(tester.id)!;
		this.container.logger.info(this.container.colorette.cyan('CacheService: Tester cached:'), tester.id);

		return cachedTester;
	}

	flushCachedTester(id: Snowflake): boolean {
		return this.testers.has(id) ?? this.testers.delete(id);
	}
}
