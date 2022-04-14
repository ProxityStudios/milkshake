import { ApplyOptions } from '@sapphire/decorators';
import { Events } from '@sapphire/framework';
import { Listener } from '@sapphire/framework';
import type { Guild } from 'discord.js';

@ApplyOptions<Listener.Options>({
	event: Events.GuildCreate
})
export class GuildEvent extends Listener<typeof Events.GuildCreate> {
	async run(guild: Guild) {
		const appGuildRepo = this.container.services.get('database').repos.app.guilds;
		const savedGuild = await appGuildRepo.findOneBy({
			id: guild.id
		});

		if (!savedGuild) {
			const defaultLanguage = this.container.config.client.defaultLanguage;
			const defaultPrefix = this.container.config.client.defaultPrefix;

			const newGuild = appGuildRepo.create({
				id: guild.id,
				name: guild.name,
				prefix: defaultPrefix,
				language: defaultLanguage
			});

			const savedGuild = await appGuildRepo.save(newGuild);
			this.container.services.get('cache').cacheGuild(savedGuild);
		}
	}
}
