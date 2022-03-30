import { ApplyOptions } from '@sapphire/decorators';
import type { Args } from '@sapphire/framework';
import { replyLocalized, sendLocalized } from '@sapphire/plugin-i18next';
import { SubCommandPluginCommand, SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
import type { Message } from 'discord.js';
import { Types, Utils } from '../../lib';
import type { DatabaseService } from '../../lib/structures/services';

@ApplyOptions<SubCommandPluginCommandOptions>({
	name: Types.AdminCategoryCommand.Language,
	subCommands: ['set', 'reset', { input: 'current', default: true }],
	preconditions: ['GuildOnly'],
	requiredUserPermissions: ['ADMINISTRATOR']
})
export class AdminCommand extends SubCommandPluginCommand {
	// async reset(message: Message, args: Args) {}
	async set(message: Message, args: Args) {
		const guildSettings = await this.container.services
			.get<DatabaseService>(Types.Service.DatabaseService)
			.repos[0].guilds?.findOneBy({ id: message.guildId! });

		if (!guildSettings) return;

		const language = await args.pickResult('string');

		if (!language.success) return replyLocalized(message, 'commands/language:SET.MISSING_ARGUMENT');
		guildSettings.language = language.value as Types.Language;

		const savedGuildSettings = await this.container.services
			.get<DatabaseService>(Types.Service.DatabaseService)
			.repos[0].guilds?.save(guildSettings!);

		return sendLocalized(message, {
			keys: 'commands/language:SET.SUCCESS',
			formatOptions: {
				guildLanguage: savedGuildSettings?.language
			}
		});
	}

	async current(message: Message) {
		const loadingMsg = await Utils.sendLoadingMessage(message);

		const guildSettings = await this.container.services
			.get<DatabaseService>(Types.Service.DatabaseService)
			.repos[0].guilds?.findOneBy({ id: message.guildId! });

		await loadingMsg.delete();
		await replyLocalized(message, {
			keys: 'commands/language:CURRENT',
			formatOptions: {
				guildLanguage: guildSettings?.language
			}
		});
	}
}
