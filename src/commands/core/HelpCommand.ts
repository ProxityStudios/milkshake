import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';
import { Message, MessageEmbed, MessageEmbedOptions } from 'discord.js';
import { Types } from '../../lib';

@ApplyOptions<Command.Options>({
	name: Types.Commands.Core.Help,
	fullCategory: [Types.Commands.Category.Core]
})
export class CoreCommand extends Command {
	async messageRun(message: Message) {
		const loadingMsg = await this.container.utils.sendLoadingMessage(message);
		const commandStore = this.container.stores.get('commands');

		const commandsByCategory: Types.Commands.CommandsByCategory[] = [
			{
				category: Types.Commands.Category.Admin,
				commands: this.container.utils.getCommandsByCategory(commandStore, Types.Commands.Category.Admin)
			},
			{
				category: Types.Commands.Category.Core,
				commands: this.container.utils.getCommandsByCategory(commandStore, Types.Commands.Category.Core)
			},
			{
				category: Types.Commands.Category.Mod,
				commands: this.container.utils.getCommandsByCategory(commandStore, Types.Commands.Category.Mod)
			}
		];

		const embed = new MessageEmbed({
			description: await resolveKey(message, 'commands/core/help:EMBED.DESCRIPTION'),
			fields: [
				{
					name: await resolveKey(message, 'CATEGORIES.ADMIN'),
					value: commandsByCategory
						.filter((c) => c.category === Types.Commands.Category.Admin)[0]
						.commands.map((n) => '`' + n + '`')
						.join(', ')
				},
				{
					name: await resolveKey(message, 'CATEGORIES.CORE'),
					value: commandsByCategory
						.filter((c) => c.category === Types.Commands.Category.Core)[0]
						.commands.map((n) => '`' + n + '`')
						.join(', ')
				}
			],
			timestamp: new Date(),
			footer: {
				text: message.author.tag,
				iconURL: message.author.displayAvatarURL()
			},
			thumbnail: {
				url: message.client.user?.displayAvatarURL({ size: 64 })
			}
		} as MessageEmbedOptions);

		// const isOwner = this.isAdmin(message);
		// const isStaff = this.isStaff(message);

		// if (isOwner) {}
		// if (isStaff) {}

		return loadingMsg.edit({ content: await resolveKey(message, 'DONE'), embeds: [embed] });
	}

	// private isOwner(message: Message): boolean {
	// 	return true;
	// }

	// private isStaff(message: Message): boolean {
	// 	return true;
	// }
}
