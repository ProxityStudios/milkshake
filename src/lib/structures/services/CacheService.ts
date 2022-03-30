import { container } from '@sapphire/framework';
import { Types } from '../..';

export default class CacheService extends Types.BaseService {
	// guilds: Map<string, GuildEntity> = new Map();

	constructor() {
		super(Types.Service.CacheService);
	}

	run() {
		container.client.logger.info('Cache service');
	}
}
