import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { editLocalized, replyLocalized } from '@sapphire/plugin-i18next';
import type { Message } from 'discord.js';
import { Types } from '../../lib';

@ApplyOptions<Command.Options>({
	name: Types.Commands.Core.Ping,
	fullCategory: [Types.Commands.Category.Core]
})
export class CoreCommand extends Command {
	async messageRun(message: Message) {
		const msg = await replyLocalized(message, 'commands/core/ping:PINGING');

		return editLocalized(msg, {
			keys: 'commands/core/ping:SUCCESS',
			formatOptions: {
				botLatency: Math.round(this.container.client.ws.ping),
				apiLatency: (msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp)
			}
		});
	}
}
