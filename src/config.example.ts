import { resolve } from 'path';
import { Types, Utils, appEntities } from './lib';

export const Config: Types.Config = {
	version: process.env.npm_package_version!,
	// development mode
	dev: false,
	client: {
		ownerIDs: ['748366237788012695'],
		staffIDs: [],
		defaultPrefix: '?',
		defaultLanguage: 'en-US',
		defaultCooldown: { delay: 3000 },
		testerGuilds: ['843939288349409331', '959964580690407475', '963893242208878632'],
		i18n: {
			defaultLanguageDirectory: resolve('i18n')
		}
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
