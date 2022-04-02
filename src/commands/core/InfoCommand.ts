import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';
import { Message, MessageEmbed, MessageEmbedOptions } from 'discord.js';
import { Types, Utils } from '../../lib';

@ApplyOptions<CommandOptions>({
	name: Types.Commands.Core.Info
})
export class CoreCommand extends Command {
	async messageRun(message: Message) {
		const loadingMsg = await Utils.sendLoadingMessage(message);
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
				url: message.client.user?.avatarURL({ size: 64 }) ?? ''
			}
		};

		const embed = new MessageEmbed(embedData);

		return loadingMsg.edit({ content: await resolveKey(message, 'common:DONE'), embeds: [embed] });
	}
}
