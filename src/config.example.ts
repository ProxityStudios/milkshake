import { Types, Utils } from './lib';
import { appEntities } from './lib/entities';

export const Config: Types.AppConfig = {
	version: process.env.npm_package_version!,
	client: {
		ownerIDs: ['748366237788012695'],
		staffIDs: [],
		defaultPrefix: '?',
		defaultLanguage: 'en'
	},
	dataSources: {
		app: {
			type: 'mysql',
			host: Utils.envParseString('APP_SOURCE_MYSQL_DATABASE_HOST', 'localhost'),
			port: Utils.envParseInteger('APP_SOURCE_MYSQL_DATABASE_PORT', 3306),
			username: Utils.envParseString('APP_SOURCE_MYSQL_DATABASE_USERNAME', 'test'),
			password: Utils.envParseString('APP_SOURCE_MYSQL_DATABASE_PASSWORD', ''),
			database: Utils.envParseString('APP_SOURCE_MYSQL_DATABASE_NAME', 'milkshake_bot_v2'),
			synchronize: true,
			logging: false,
			entities: appEntities,
			subscribers: [],
			migrations: []
		}
	}
};
