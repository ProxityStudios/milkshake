import { container } from '@sapphire/framework';
import type { BaseService } from '../../types';

export default class DatabaseService implements BaseService {
	run() {
		container.client.logger.info('Database service');
	}
}
