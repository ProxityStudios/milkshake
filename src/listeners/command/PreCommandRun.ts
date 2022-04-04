import { ApplyOptions } from '@sapphire/decorators';
import { Events, ListenerOptions, PreCommandRunPayload } from '@sapphire/framework';
import { Listener } from '@sapphire/framework';
import { replyLocalized } from '@sapphire/plugin-i18next';
import { AppGuildEntity, DatabaseService } from '../../lib';

@ApplyOptions<ListenerOptions>({
	event: Events.PreCommandRun
})
export class CommandEvent extends Listener<typeof Events.PreCommandRun> {
	async run({ message }: PreCommandRunPayload) {
		if (!message.guild) return;

		const appDataManager = this.container.services.get<DatabaseService>('DATABASE').dataSources.app.manager;
		const savedGuild = await appDataManager.findOneBy(AppGuildEntity, {
			id: message.guild.id
		});

		if (!savedGuild) {
			const msg = await replyLocalized(message, 'listeners/command/pre-command-run:SETTING_GUILD');

			const defaultLanguage = this.container.config.client.defaultLanguage;
			const defaultPrefix = this.container.config.client.defaultPrefix;

			const newGuild = appDataManager.create(AppGuildEntity, {
				id: message.guild.id,
				name: message.guild.name,
				prefix: defaultPrefix,
				language: defaultLanguage
			});

			await appDataManager.save(newGuild);
			await msg.delete();
		}
	}
}
