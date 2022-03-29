import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { Types } from '../../lib';

@ApplyOptions<CommandOptions>({
	name: Types.StaffCategoryCommand.Example,
	preconditions: [[Types.Precondition.OwnerOnly, Types.Precondition.StaffOnly]]
})
export class StaffCommand extends Command {
	async messageRun(message: Message) {
		return message.reply('Hello staff!');
	}
}
