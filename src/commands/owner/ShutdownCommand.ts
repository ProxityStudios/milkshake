import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import { sendLocalized } from '@sapphire/plugin-i18next';
import type { Message } from 'discord.js';
import { Types } from '../../lib';

@ApplyOptions<CommandOptions>({
	name: Types.OwnerCategoryCommand.Shutdown,
	preconditions: [Types.Precondition.OwnerOnly]
})
export class OwnerCommand extends Command {
	async messageRun(message: Message) {
		await sendLocalized(message, 'commands/shutdown:SUCCESS');
		return this.container.client.destroy();
	}
}
