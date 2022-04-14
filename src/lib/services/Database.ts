import { DataSource, Repository } from 'typeorm';

import { AppGuildEntity, AppTesterEntity, Types } from '..';
import BaseService from '../structures/BaseService';

export default class Database extends BaseService {
	dataSources: Types.Database.DataSources = {
		app: new DataSource(this.container.config.dataSources.app)
	};

	sources: {
		appDataSource: DataSource;
	};
	repos: {
		app: {
			guilds: Repository<AppGuildEntity>;
			testers: Repository<AppTesterEntity>;
		};
	};

	constructor() {
		super('database');
	}

	async run() {
		this.container.logger.info(this.container.colorette.gray('DatabaseService: Initializing data sources...'));
		await this.initDataSources();
		this.container.logger.info(
			this.container.colorette.green('DatabaseService: DataSources initialized:'),
			Object.entries(this.dataSources)
				.filter(([_, dataSource]: [key: string, dataSource: DataSource]) => dataSource.isInitialized)
				.map((entry) => entry[0])
		);

		this.sources = {
			appDataSource: this.dataSources.app
		};
		this.repos = {
			app: {
				guilds: this.dataSources.app.getRepository(AppGuildEntity),
				testers: this.dataSources.app.getRepository(AppTesterEntity)
			}
		};
	}

	private async initDataSources() {
		for (const [_, dataSource] of Object.entries(this.dataSources)) {
			if (dataSource instanceof DataSource) {
				await dataSource.initialize();
			}
		}
	}
}
