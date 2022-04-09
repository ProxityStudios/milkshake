import { gray, green } from 'colorette';
import { DataSource } from 'typeorm';
import type { Types } from '..';
import BaseService from '../structures/BaseService';

export default class Database extends BaseService {
	dataSources: Types.Database.DataSources = {
		app: new DataSource(this.container.config.dataSources.app)
	};

	constructor() {
		super('DATABASE');
	}

	async run() {
		this.container.logger.info(gray('Initializing data sources...'));
		await this.initDataSources();
		this.container.logger.info(
			green('DataSources initialized:'),
			Object.entries(this.dataSources)
				.filter(([_, dataSource]: [key: string, dataSource: DataSource]) => dataSource.isInitialized)
				.map((entry) => entry[0])
		);
	}

	private async initDataSources() {
		for (const [_, dataSource] of Object.entries(this.dataSources)) {
			if (dataSource instanceof DataSource) {
				await dataSource.initialize();
			}
		}
	}
}
