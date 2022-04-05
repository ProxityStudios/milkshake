import { ApplyOptions } from '@sapphire/decorators';
import type { Args } from '@sapphire/framework';
import { replyLocalized, resolveKey } from '@sapphire/plugin-i18next';
import { SubCommandPluginCommand, SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
import type { Message } from 'discord.js';
import { AppGuildEntity, DatabaseService, Types, Utils } from '../../lib';

@ApplyOptions<SubCommandPluginCommandOptions>({
	name: Types.Commands.Admin.Language,
	requiredUserPermissions: ['ADMINISTRATOR'],
	preconditions: ['GuildOnly'],
	subCommands: ['set', 'reset', { input: 'show', default: true }]
})
export class StaffCommand extends SubCommandPluginCommand {
	async set(message: Message, args: Args) {
		const loadingMsg = await this.container.utils.sendLoadingMessage(message);
		const appDataManager = this.container.services.get<DatabaseService>('DATABASE').dataSources.app.manager;
		const savedGuild = await appDataManager.findOneBy(AppGuildEntity, {
			id: message.guild?.id
		});

		if (!savedGuild) return;

		const languageArg = await args.pickResult('string');
		const langs = Utils.getLanguages();

		if (languageArg.error) {
			return loadingMsg.edit(
				await resolveKey(message, 'common:MISSING_ARGUMENT', {
					argument: langs.join(' | ')
				})
			);
		}

		if (!langs.includes(languageArg.value)) {
			return loadingMsg.edit(await resolveKey(message, 'commands/admin/language:SET.INVALID_LANG'));
		}

		savedGuild.language = languageArg.value as Types.LanguageStrings;

		await appDataManager.save(savedGuild);

		return loadingMsg.edit(
			await resolveKey(message, 'commands/admin/language:SET.SUCCESS', {
				guildLanguage: savedGuild.language
			})
		);
	}

	reset(message: Message) {
		return replyLocalized(message, 'common:DONE');
	}

	async show(message: Message) {
		const loadingMsg = await this.container.utils.sendLoadingMessage(message);
		const appDataManager = this.container.services.get<DatabaseService>('DATABASE').dataSources.app.manager;
		const savedGuild = await appDataManager.findOneBy(AppGuildEntity, {
			id: message.guild?.id
		});

		return loadingMsg.edit({
			content: await resolveKey(message, 'commands/admin/language:CURRENT', {
				guildLanguage: savedGuild?.language
			})
		});
	}
}
