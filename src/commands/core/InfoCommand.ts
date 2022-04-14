import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';
import { Message, MessageEmbed, MessageEmbedOptions } from 'discord.js';

import { Types } from '../../lib';

@ApplyOptions<Command.Options>({
	name: Types.Commands.Core.Info,
	fullCategory: [Types.Commands.Category.Core]
})
export class CoreCommand extends Command {
	async messageRun(message: Message) {
		const loadingMsg = await this.container.utils.sendLoadingMessage(message);
		const embedTexts = {
			description: await resolveKey(message, 'commands/core/info:EMBED.DESCRIPTION'),
			fields: {
				0: {
					name: await resolveKey(message, 'commands/core/info:EMBED.FIELDS.0.NAME'),
					value: await resolveKey(message, 'commands/core/info:EMBED.FIELDS.0.VALUE', { addTheBot: 'https://proxitystudios.tk' })
				}
			}
		};

		const embedData: MessageEmbedOptions = {
			description: embedTexts.description,
			fields: [
				{
					name: embedTexts.fields[0].name,
					value: embedTexts.fields[0].value
				}
			],
			footer: {
				text: message.author.tag,
				iconURL: message.author.displayAvatarURL()
			},
			timestamp: new Date(),
			thumbnail: {
				url: message.client.user?.displayAvatarURL({ size: 64 })
			}
		};

		const embed = new MessageEmbed(embedData);

		return loadingMsg.edit({ content: await resolveKey(message, 'DONE'), embeds: [embed] });
	}
}
