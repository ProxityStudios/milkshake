import { ApplyOptions } from '@sapphire/decorators';
import { Events } from '@sapphire/framework';
import { Listener } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<Listener.Options>({
	event: Events.MentionPrefixOnly
})
export class UserEvent extends Listener<typeof Events.MentionPrefixOnly> {
	public async run(message: Message) {
		const prefix = this.container.client.options.defaultPrefix;
		return message.channel.send({ content: `My prefix in this guild is: \`${prefix}\``, allowedMentions: { users: [message.author.id] } });
	}
}
