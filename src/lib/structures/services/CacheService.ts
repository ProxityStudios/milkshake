import { container } from '@sapphire/framework';
import type { BaseService } from '../../types';

export default class CacheService implements BaseService {
	// guilds: Map<string, GuildEntity> = new Map();

	run() {
		container.client.logger.info('Cache service');
	}
}
