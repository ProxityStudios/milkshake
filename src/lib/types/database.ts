import type { DataSource, Repository } from 'typeorm';
import type { AppGuildEntity, AppTesterEntity } from '..';

export interface DataSources {
	app: DataSource;
}

export interface Sources {
	appDataSource: DataSource;
}

export interface Repositories {
	app: {
		guilds: Repository<AppGuildEntity>;
		testers: Repository<AppTesterEntity>;
	};
}
