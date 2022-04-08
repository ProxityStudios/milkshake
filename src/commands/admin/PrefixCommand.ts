import { ApplyOptions } from '@sapphire/decorators';
import type { Args } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';
import { SubCommandPluginCommand, SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
import type { Message } from 'discord.js';
import { AppGuildEntity, DatabaseService, Types } from '../../lib';

@ApplyOptions<SubCommandPluginCommandOptions>({
	name: Types.Commands.Admin.Prefix,
	requiredUserPermissions: ['ADMINISTRATOR'],
	preconditions: ['GuildOnly'],
	subCommands: ['set', 'reset', { input: 'show', default: true }]
})
export class AdminCommand extends SubCommandPluginCommand {
	async set(message: Message, args: Args) {
		const loadingMsg = await this.container.utils.sendLoadingMessage(message);
		const appDataManager = this.container.services.get<DatabaseService>('DATABASE').dataSources.app.manager;
		const savedGuild = await appDataManager.findOneBy(AppGuildEntity, {
			id: message.guild?.id
		});

		if (!savedGuild) return;

		const prefixArg = await args.pickResult('string');

		if (prefixArg.error) {
			return loadingMsg.edit(
				await resolveKey(message, 'MISSING_ARGUMENT', {
					argument: '<prefix>'
				})
			);
		}

		savedGuild.prefix = prefixArg.value;

		const updatedGuild = await appDataManager.save(savedGuild);

		return loadingMsg.edit(
			await resolveKey(message, 'commands/admin/prefix:SET.SUCCESS', {
				guildPrefix: updatedGuild.prefix
			})
		);
	}

	async reset(message: Message) {
		const loadingMsg = await this.container.utils.sendLoadingMessage(message);
		const appDataManager = this.container.services.get<DatabaseService>('DATABASE').dataSources.app.manager;
		const savedGuild = await appDataManager.findOneBy(AppGuildEntity, {
			id: message.guild?.id
		});

		if (!savedGuild) return;

		savedGuild.prefix = this.container.config.client.defaultPrefix;

		const updatedGuild = await appDataManager.save(savedGuild);

		return loadingMsg.edit(
			await resolveKey(message, 'commands/admin/prefix:RESET.SUCCESS', {
				guildPrefix: updatedGuild.prefix
			})
		);
	}

	async show(message: Message) {
		const loadingMsg = await this.container.utils.sendLoadingMessage(message);
		const appDataManager = this.container.services.get<DatabaseService>('DATABASE').dataSources.app.manager;

		const savedGuild = await appDataManager.findOneBy(AppGuildEntity, {
			id: message.guild?.id
		});

		if (!savedGuild) return;

		return loadingMsg.edit({
			content: await resolveKey(message, 'commands/admin/prefix:CURRENT', {
				guildPrefix: savedGuild?.prefix
			})
		});
	}
}
