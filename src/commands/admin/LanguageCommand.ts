import { ApplyOptions } from '@sapphire/decorators';
import type { Args } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';
import { SubCommandPluginCommand } from '@sapphire/plugin-subcommands';
import type { Message } from 'discord.js';

import { Keys, Types } from '../../lib';

@ApplyOptions<SubCommandPluginCommand.Options>({
	name: Types.Commands.Admin.Language,
	fullCategory: [Types.Commands.Category.Admin],
	requiredUserPermissions: ['ADMINISTRATOR'],
	preconditions: ['GuildOnly'],
	subCommands: ['set', 'reset', { input: 'check', default: true }]
})
export class AdminCommand extends SubCommandPluginCommand {
	private db = this.container.services.get('database');
	private cache = this.container.services.get('cache');

	private appGuildRepo = this.db.repos.app.guilds;

	async set(message: Message, args: Args) {
		const loadingMsg = await this.container.utils.sendLoadingMessage(message);
		const savedGuild = this.cache.guilds.get(message.guild!.id)!;
		const languageArg = await args.pickResult('string');
		const langs = this.container.utils.getLanguages();

		if (languageArg.error) {
			return loadingMsg.edit(
				await resolveKey(message, Keys.Common.MissingArguments, {
					arguments: langs.join(' | ')
				})
			);
		}

		if (!langs.includes(languageArg.value)) {
			return loadingMsg.edit(await resolveKey(message, Keys.Language.Set.InvalidLanguage));
		}

		savedGuild.language = languageArg.value as Types.LanguageStrings;

		const updatedGuild = await this.appGuildRepo.save(savedGuild);
		this.cache.cacheGuild(updatedGuild);

		return loadingMsg.edit(
			await resolveKey(message, Keys.Language.Set.Success, {
				guildLanguage: updatedGuild.language
			})
		);
	}

	async reset(message: Message) {
		const loadingMsg = await this.container.utils.sendLoadingMessage(message);
		const savedGuild = this.cache.guilds.get(message.guild?.id!)!;

		savedGuild.language = this.container.config.client.defaultLanguage;

		const updatedGuild = await this.appGuildRepo.save(savedGuild);
		this.cache.cacheGuild(updatedGuild);

		return loadingMsg.edit(
			await resolveKey(message, Keys.Language.Reset.Success, {
				guildLanguage: updatedGuild.language
			})
		);
	}

	async check(message: Message) {
		const loadingMsg = await this.container.utils.sendLoadingMessage(message);
		const language = this.cache.guilds.get(message.guild!.id)!.language;

		return loadingMsg.edit({
			content: await resolveKey(message, Keys.Language.Current, {
				guildLanguage: language
			})
		});
	}
}
