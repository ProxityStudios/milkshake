import type { DataSource, Repository } from 'typeorm';
import type { AppGuildEntity, AppTesterEntity, CacheService, DatabaseService } from '..';

export interface Names {
	database: DatabaseService;
	cache: CacheService;
}

export type Key = keyof Names;
export type Value = Names[Key];

export interface ServiceDBOptions {
	sources: {
		appDataSource: DataSource | null;
	};
	repos: {
		app: {
			guild: Repository<AppGuildEntity> | null;
			tester: Repository<AppTesterEntity> | null;
		};
	};
}
