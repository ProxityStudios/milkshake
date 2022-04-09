import { ApplyOptions } from '@sapphire/decorators';
import { Precondition } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';
import type { Message } from 'discord.js';
import { Types } from '../../lib';

@ApplyOptions<Precondition.Options>({
	name: Types.Preconditions.Staff.StaffOnly
})
export class UserPrecondition extends Precondition {
	async run(message: Message) {
		 return this.container.config.client.staffIDs.includes(message.author.id)
		 	? this.ok()
		 	: this.error({ message: await resolveKey(message, 'preconditions/staff/staff-only:ERROR') });
		// return this.container.config.client.staffIDs.includes(message.author.id) ? this.ok() : this.error();
	}
}
