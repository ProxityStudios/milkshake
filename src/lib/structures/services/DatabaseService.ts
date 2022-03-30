import { container } from '@sapphire/framework';
import { gray, green, red, yellow } from 'colorette';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Database, Types } from '../..';

export default class DatabaseService extends Types.BaseService {
	dataSources: Map<any, DataSource> = new Map();
	repos: Types.Repositories = {
		0: {
			guilds: null
		}
	};

	constructor() {
		super(Types.Service.DatabaseService);
	}

	async run() {
		container.client.logger.info(gray('Database service loading...'));

		const appSource = await this.createDataSource(Types.DataSource.AppDataSource, container.config.database.dataSources[0]);
		this.initializeAppDataSourceRepos(appSource);
	}

	private initializeAppDataSourceRepos(dataSource: DataSource) {
		this.repos[0] = {
			guilds: dataSource.getRepository(Database.AppDataSource.GuildEntity)
		};
	}

	async createDataSource(name: Types.DataSource, options: DataSourceOptions): Promise<DataSource> {
		const source = new DataSource(options);
		await this.initializeSource(name, source);

		return source;
	}

	getSource(name: Types.DataSource): DataSource | undefined {
		return this.dataSources.get(name);
	}

	async initializeSource(name: Types.DataSource, dataSource: DataSource): Promise<boolean | DataSource> {
		container.logger.info(gray('Initializing source:'), yellow(name));

		const isExists = this.getSource(name);

		if (isExists) {
			container.logger.warn(yellow('Already found a connection to source:'), name);
			return false;
		}

		return dataSource
			.initialize()
			.then((source) => {
				container.logger.info(green('Connected source:'), yellow(name));
				return source;
			})
			.catch((e) => {
				container.logger.fatal(red(e));
				setTimeout(() => {
					container.logger.info(gray('Retrying to connect source:'), yellow(name));
					this.initializeSource(name, dataSource);
				}, 5000);
				return false;
			});
	}
}
