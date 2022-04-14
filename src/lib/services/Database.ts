import { DataSource } from 'typeorm';

import { AppGuildEntity, AppTesterEntity, Types } from '..';
import BaseService from '../structures/BaseService';

export default class Database extends BaseService {
	readonly dataSources: Types.Database.DataSources;

	readonly sources: Types.Database.Sources;
	readonly repos: Types.Database.Repositories;

	constructor() {
		super('database');

		// merge with <this.sources>
		this.dataSources = {
			app: new DataSource(this.container.config.dataSources.app)
		};

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

	async run() {
		this.container.logger.info(this.container.colorette.gray('DatabaseService: Initializing data sources...'));
		await this.initDataSources();
		this.container.logger.info(
			this.container.colorette.green('DatabaseService: DataSources initialized:'),
			Object.entries(this.dataSources)
				.filter(([_, dataSource]: [key: string, dataSource: DataSource]) => dataSource.isInitialized)
				.map((entry) => entry[0])
		);
	}

	private async initDataSources() {
		for await (const [_, dataSource] of Object.entries(this.dataSources)) {
			if (dataSource instanceof DataSource) {
				await dataSource.initialize();
			}
		}
	}
}
