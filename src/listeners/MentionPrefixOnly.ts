import { ApplyOptions } from '@sapphire/decorators';
import { Events } from '@sapphire/framework';
import { Listener } from '@sapphire/framework';
import { reply } from '@sapphire/plugin-editable-commands';
import { resolveKey } from '@sapphire/plugin-i18next';
import type { Message } from 'discord.js';

@ApplyOptions<Listener.Options>({
	event: Events.MentionPrefixOnly
})
export class UserEvent extends Listener<typeof Events.MentionPrefixOnly> {
	async run(message: Message) {
		const prefix = await this.container.client.fetchPrefix(message);
		return reply(
			message,
			await resolveKey(message, 'CURRENT_PREFIX', {
				guildPrefix: prefix
			})
		);
	}
}
