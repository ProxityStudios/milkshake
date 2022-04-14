import { ApplyOptions } from '@sapphire/decorators';
import { Precondition } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';
import type { Message } from 'discord.js';

import { Types } from '../../lib';

@ApplyOptions<Precondition.Options>({
	name: Types.Preconditions.Tester.BetaTesterOnly
})
export class TesterPrecondition extends Precondition {
	async run(message: Message) {
		const betaTesters = this.container.services.get('cache').testers.filter((t) => t.roles.includes(Types.Tester.Role.BETA));

		return betaTesters.has(message.author.id)
			? this.ok()
			: this.error({ message: await resolveKey(message, 'preconditions/tester/beta-tester-only:ERROR') });
	}
}
