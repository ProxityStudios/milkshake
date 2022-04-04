import type { Types } from '..';

export default abstract class BaseService {
	constructor(public name: Types.Service.Name) {}

	abstract run(): any;
}
