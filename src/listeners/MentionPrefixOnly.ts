import { ApplyOptions } from '@sapphire/decorators';
import { Events } from '@sapphire/framework';
import { Listener } from '@sapphire/framework';
import { reply } from '@sapphire/plugin-editable-commands';
import { resolveKey } from '@sapphire/plugin-i18next';
import type { Message } from 'discord.js';
import type { CacheService } from '../lib';

@ApplyOptions<Listener.Options>({
	event: Events.MentionPrefixOnly
})
export class UserEvent extends Listener<typeof Events.MentionPrefixOnly> {
	async run(message: Message) {
		if (!message.guild) return;

		const prefix = this.container.services.get<CacheService>('CACHE').guilds.get(message.guild.id);
		return reply(
			message,
			await resolveKey(message, 'CURRENT_PREFIX', {
				guildPrefix: prefix
			})
		);
	}
}
