import { ApplyOptions } from '@sapphire/decorators';
import { Events, ListenerOptions } from '@sapphire/framework';
import { Listener } from '@sapphire/framework';
import type { Guild } from 'discord.js';
import { Entities } from '../../lib';
import type { Database } from '../../lib/services/Database';

@ApplyOptions<ListenerOptions>({
	event: Events.GuildCreate
})
export class GuildEvent extends Listener<typeof Events.GuildCreate> {
	async run(guild: Guild) {
		const appDataManager = this.container.services.get<Database>('DATABASE')?.dataSources.app.manager;
		const savedGuild = await appDataManager.findOneBy(Entities.App.Guild, {
			id: guild.id
		});

		if (!savedGuild) {
			const defaultLanguage = this.container.config.client.defaultLanguage;
			const defaultPrefix = this.container.config.client.defaultPrefix;

			const newGuild = appDataManager.create(Entities.App.Guild, {
				id: guild.id,
				name: guild.name,
				prefix: defaultPrefix,
				language: defaultLanguage
			});

			await appDataManager.save(newGuild);
		}
	}
}
