import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';
import { Message, MessageEmbed, MessageEmbedOptions } from 'discord.js';
import { AppGuildEntity, DatabaseService, Types } from '../../lib';

@ApplyOptions<CommandOptions>({
	name: Types.Commands.Staff.BotInformation,
	preconditions: [[Types.Preconditions.Owner.OwnerOnly, Types.Preconditions.Staff.StaffOnly]]
})
export class StaffCommand extends Command {
	async messageRun(message: Message) {
		const loadingMsg = await this.container.utils.sendLoadingMessage(message);
		const appDataManager = this.container.services.get<DatabaseService>('DATABASE').dataSources.app.manager;

		const embedTexts = {
			description: await resolveKey(message, 'commands/staff/bot-info:EMBED.DESCRIPTION'),
			fields: {
				0: {
					name: await resolveKey(message, 'commands/staff/bot-info:EMBED.FIELDS.0.NAME'),
					value: await resolveKey(message, 'commands/staff/bot-info:EMBED.FIELDS.0.VALUE', {
						totalGuildCount: this.container.client.guilds.cache.size,
						totalUserCount: this.container.client.users.cache.size,
						cachedGuildCount: await appDataManager.count(AppGuildEntity)
					})
				}
			},
			footer: {
				text: await resolveKey(message, 'commands/staff/bot-info:EMBED.FOOTER.TEXT', { appVersion: this.container.config.version })
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
				text: embedTexts.footer.text,
				iconURL: message.client.user?.avatarURL() ?? ''
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
