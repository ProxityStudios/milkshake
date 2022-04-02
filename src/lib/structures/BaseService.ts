import type { Types } from '..';

export abstract class BaseService {
	constructor(public name: Types.Service.Name) {}

	abstract run(): any;
}
