import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import { editLocalized, replyLocalized } from '@sapphire/plugin-i18next';
import type { Message } from 'discord.js';
import { Types } from '../../lib';

@ApplyOptions<CommandOptions>({
	name: Types.CoreCategoryCommand.Ping
})
export class UserCommand extends Command {
	async messageRun(message: Message) {
		const msg = await replyLocalized(message, 'commands/ping:PINGING');

		return editLocalized(msg, {
			keys: 'commands/ping:SUCCESS',
			formatOptions: {
				botLatency: Math.round(this.container.client.ws.ping),
				apiLatency: (msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp)
			}
		});
	}
}
