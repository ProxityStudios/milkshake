import { ApplyOptions } from '@sapphire/decorators';
import { Precondition, PreconditionOptions } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';
import type { Message } from 'discord.js';
import { Types } from '../../lib';

@ApplyOptions<PreconditionOptions>({
	name: Types.Preconditions.Owner.OwnerOnly
})
export class UserPrecondition extends Precondition {
	async run(message: Message) {
		return this.container.config.client.ownerIDs.includes(message.author.id)
			? this.ok()
			: this.error({ message: await resolveKey(message, 'preconditions/owner/owner-only:ERROR') });
	}
}
