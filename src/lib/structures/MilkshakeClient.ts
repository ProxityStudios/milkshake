import { SapphireClient, container } from '@sapphire/framework';
import type { ClientOptions } from 'discord.js';

export class MilkshakeClient extends SapphireClient {
	constructor(opts: ClientOptions) {
		super(opts);
		container.client = this;
	}

	async start() {
		const response = await super.login();
		return response;
	}

	async destroy() {
		return super.destroy();
	}
}
