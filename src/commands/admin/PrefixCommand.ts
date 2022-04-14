import { ApplyOptions } from '@sapphire/decorators';
import type { Args } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';
import { SubCommandPluginCommand } from '@sapphire/plugin-subcommands';
import type { Message } from 'discord.js';

import { Types } from '../../lib';

@ApplyOptions<SubCommandPluginCommand.Options>({
	name: Types.Commands.Admin.Prefix,
	fullCategory: [Types.Commands.Category.Admin],
	requiredUserPermissions: ['ADMINISTRATOR'],
	preconditions: ['GuildOnly'],
	subCommands: ['set', 'reset', { input: 'check', default: true }]
})
export class AdminCommand extends SubCommandPluginCommand {
	private appDataManager = this.container.services.get('database').dataSources.app.manager;
	private cache = this.container.services.get('cache');

	async set(message: Message, args: Args) {
		const loadingMsg = await this.container.utils.sendLoadingMessage(message);
		const savedGuild = this.cache.guilds.get(message.guild!.id)!;
		const prefixArg = await args.pickResult('string');

		if (prefixArg.error) {
			return loadingMsg.edit(
				await resolveKey(message, 'MISSING_ARGUMENTS', {
					arguments: '<prefix>'
				})
			);
		}

		savedGuild.prefix = prefixArg.value;

		const updatedGuild = await this.appDataManager.save(savedGuild);
		this.cache.cacheGuild(updatedGuild);

		return loadingMsg.edit(
			await resolveKey(message, 'commands/admin/prefix:SET.SUCCESS', {
				guildPrefix: updatedGuild.prefix
			})
		);
	}

	async reset(message: Message) {
		const loadingMsg = await this.container.utils.sendLoadingMessage(message);
		const savedGuild = this.cache.guilds.get(message.guild!.id)!;

		if (!savedGuild) return;

		savedGuild.prefix = this.container.config.client.defaultPrefix;

		const updatedGuild = await this.appDataManager.save(savedGuild);
		this.cache.cacheGuild(updatedGuild);

		return loadingMsg.edit(
			await resolveKey(message, 'commands/admin/prefix:RESET.SUCCESS', {
				guildPrefix: updatedGuild.prefix
			})
		);
	}

	async check(message: Message) {
		const loadingMsg = await this.container.utils.sendLoadingMessage(message);
		const prefix = await message.client.fetchPrefix(message);

		return loadingMsg.edit({
			content: await resolveKey(message, 'commands/admin/prefix:CURRENT', {
				guildPrefix: prefix
			})
		});
	}
}
