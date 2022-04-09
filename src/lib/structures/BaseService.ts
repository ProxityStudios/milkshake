import { container } from '@sapphire/framework';
import type { Types } from '..';

export default abstract class BaseService {
	protected container = container;

	constructor(public name: Types.Service.Name) {}

	abstract run(): any;
}
