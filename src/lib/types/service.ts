import type { CacheService, DatabaseService } from '..';

export interface Names {
	database: DatabaseService;
	cache: CacheService;
}

export type Key = keyof Names;
export type Value = Names[Key];
