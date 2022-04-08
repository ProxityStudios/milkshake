import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';
import type { Message } from 'discord.js';
import { Types } from '../../lib';

@ApplyOptions<Command.Options>({
	name: Types.Commands.Mod.Ban,
	fullCategory: [Types.Commands.Category.Mod]
})
export class CoreCommand extends Command {
	async messageRun(message: Message) {
		const loadingMsg = await this.container.utils.sendLoadingMessage(message);

		return loadingMsg.edit({ content: await resolveKey(message, 'DONE') });
	}
}
