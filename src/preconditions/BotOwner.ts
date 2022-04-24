import { Precondition } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class UserPrecondition extends Precondition {
	public async run(message: Message) {
		return this.container.config.client.ownerIDs.includes(message.author.id) ? this.ok() : this.error({ message: 'This command can only be used by the bot owner.' });
	}
}
