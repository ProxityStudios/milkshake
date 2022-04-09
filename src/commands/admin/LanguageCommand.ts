import { ApplyOptions } from '@sapphire/decorators';
import type { Args } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';
import { SubCommandPluginCommand } from '@sapphire/plugin-subcommands';
import type { Message } from 'discord.js';
import { CacheService, DatabaseService, Types } from '../../lib';

@ApplyOptions<SubCommandPluginCommand.Options>({
	name: Types.Commands.Admin.Language,
	fullCategory: [Types.Commands.Category.Admin],
	requiredUserPermissions: ['ADMINISTRATOR'],
	preconditions: ['GuildOnly'],
	subCommands: ['set', 'reset', { input: 'show', default: true }]
})
export class AdminCommand extends SubCommandPluginCommand {
	async set(message: Message, args: Args) {
		const loadingMsg = await this.container.utils.sendLoadingMessage(message);
		const appDataManager = this.container.services.get<DatabaseService>('DATABASE').dataSources.app.manager;
		const cacheService = this.container.services.get<CacheService>('CACHE');

		const savedGuild = cacheService.guilds.get(message.guild!.id)!;

		const languageArg = await args.pickResult('string');
		const langs = this.container.utils.getLanguages();

		if (languageArg.error) {
			return loadingMsg.edit(
				await resolveKey(message, 'MISSING_ARGUMENT', {
					argument: langs.join(' | ')
				})
			);
		}

		if (!langs.includes(languageArg.value)) {
			return loadingMsg.edit(await resolveKey(message, 'commands/admin/language:SET.INVALID_LANG'));
		}

		savedGuild.language = languageArg.value as Types.LanguageStrings;

		const updatedGuild = await appDataManager.save(savedGuild);
		cacheService.cacheGuild(updatedGuild.id);

		return loadingMsg.edit(
			await resolveKey(message, 'commands/admin/language:SET.SUCCESS', {
				guildLanguage: updatedGuild.language
			})
		);
	}

	async reset(message: Message) {
		const loadingMsg = await this.container.utils.sendLoadingMessage(message);
		const appDataManager = this.container.services.get<DatabaseService>('DATABASE').dataSources.app.manager;
		const cacheService = this.container.services.get<CacheService>('CACHE');

		const savedGuild = cacheService.guilds.get(message.guild!.id)!;

		savedGuild.language = this.container.config.client.defaultLanguage;

		const updatedGuild = await appDataManager.save(savedGuild);
		cacheService.cacheGuild(updatedGuild.id);

		return loadingMsg.edit(
			await resolveKey(message, 'commands/admin/language:RESET.SUCCESS', {
				guildLanguage: updatedGuild.language
			})
		);
	}

	async show(message: Message) {
		const loadingMsg = await this.container.utils.sendLoadingMessage(message);
		const cachedGuild = this.container.services.get<CacheService>('CACHE').guilds.get(message.guild!.id)!;

		return loadingMsg.edit({
			content: await resolveKey(message, 'commands/admin/language:CURRENT', {
				guildLanguage: cachedGuild.language
			})
		});
	}
}
