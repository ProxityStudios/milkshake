import { GatewayServer, SlashCreator, SlashCreatorOptions } from 'slash-create';
import type BaseClient from './BaseClient';

export default class BaseSlashCreator extends SlashCreator {
	client: BaseClient;

	constructor(client: BaseClient, options: SlashCreatorOptions) {
		super(options);

		this.client = client;
		options.client = client;
	}

	withClient(): this {
		return this.withServer(new GatewayServer((handler) => this.client.ws.on('INTERACTION_CREATE', handler)));
	}

	registerCommandsInAndSync(path: string) {
		return this.registerCommandsIn(path).syncCommands({
			syncGuilds: true,
			deleteCommands: true
		});
	}
}
