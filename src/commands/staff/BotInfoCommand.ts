import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';
import { Message, MessageEmbed, MessageEmbedOptions } from 'discord.js';
import { CacheService, Types } from '../../lib';

@ApplyOptions<Command.Options>({
	name: Types.Commands.Staff.BotInformation,
	fullCategory: [Types.Commands.Category.Staff],
	preconditions: [[Types.Preconditions.Owner.OwnerOnly, Types.Preconditions.Staff.StaffOnly]]
})
export class StaffCommand extends Command {
	async messageRun(message: Message) {
		const loadingMsg = await this.container.utils.sendLoadingMessage(message);
		const cacheService = this.container.services.get<CacheService>('CACHE');

		const embed = new MessageEmbed({
			description: await resolveKey(message, 'commands/staff/bot-info:EMBED.DESCRIPTION'),
			fields: [
				{
					name: await resolveKey(message, 'commands/staff/bot-info:EMBED.FIELDS.0.NAME'),
					value: await resolveKey(message, 'commands/staff/bot-info:EMBED.FIELDS.0.VALUE', {
						totalGuildCount: this.container.client.guilds.cache.size,
						totalUserCount: this.container.client.users.cache.size,
						cachedGuildCount: cacheService.guilds.size
					})
				}
			],
			footer: {
				text: await resolveKey(message, 'commands/staff/bot-info:EMBED.FOOTER.TEXT', { appVersion: this.container.config.version }),
				iconURL: message.client.user?.displayAvatarURL()
			},
			timestamp: new Date(),
			thumbnail: {
				url: message.client.user?.displayAvatarURL({ size: 64 })
			}
		} as MessageEmbedOptions);

		return loadingMsg.edit({ content: await resolveKey(message, 'DONE'), embeds: [embed] });
	}
}
