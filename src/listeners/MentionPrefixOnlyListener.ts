import { ApplyOptions } from '@sapphire/decorators';
import { Events, ListenerOptions } from '@sapphire/framework';
import { Listener } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<ListenerOptions>({
	event: Events.MentionPrefixOnly
})
export class UserEvent extends Listener<typeof Events.MentionPrefixOnly> {
	async run(message: Message) {
		const prefix = this.container.client.options.defaultPrefix;
		return message.channel.send(prefix ? `My prefix in this guild is: \`${prefix}\`` : 'You do not need a prefix in DMs.');
	}
}
