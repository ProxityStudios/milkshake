import { container } from '@sapphire/framework';
import { CommandContext, SlashCommand } from 'slash-create';
import type { BaseSlashCreator } from '../../lib';

// integrate <container> to slash commands
export default class CoreSlashCommand extends SlashCommand {
	constructor(creator: BaseSlashCreator) {
		super(creator, {
			name: 'ping',
			description: 'Pinging the bot.',
			guildIDs: container.config.client.testerGuilds
		});

		this.filePath = __filename;
	}

	async run(ctx: CommandContext) {
		await ctx.defer();

		const val = new Promise((res) => {
			setTimeout(() => res('Pong'), 2000);
		});
		return val;
	}
}
