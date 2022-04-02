import { container } from '@sapphire/framework';
import { gray, green } from 'colorette';
import { DataSource } from 'typeorm';
import type { Types } from '..';
import { BaseService } from '../structures/BaseService';

export class Database extends BaseService {
	dataSources: Types.Database.DataSources = {
		app: new DataSource(container.config.dataSources.app)
	};

	constructor() {
		super('DATABASE');
	}

	async run() {
		container.logger.info(gray('Initializing data sources...'));
		await this.initDataSources();
		container.logger.info(
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
