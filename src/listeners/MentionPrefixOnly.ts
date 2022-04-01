import { ApplyOptions } from '@sapphire/decorators';
import { Events, ListenerOptions } from '@sapphire/framework';
import { Listener } from '@sapphire/framework';
import { reply } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';

@ApplyOptions<ListenerOptions>({
	event: Events.MentionPrefixOnly
})
export class UserEvent extends Listener<typeof Events.MentionPrefixOnly> {
	async run(message: Message) {
		const prefix = await this.container.client.fetchPrefix(message);
		return reply(message, `My prefix in this guild is: \`${prefix}\``);
	}
}
