import { ApplyOptions } from '@sapphire/decorators';
import { Command, RegisterBehavior } from '@sapphire/framework';
import { editLocalized, replyLocalized, resolveKey } from '@sapphire/plugin-i18next';
import type { CommandInteraction, Message, TextBasedChannel } from 'discord.js';

import { Config } from '../../config';
import { Keys, Types } from '../../lib';

@ApplyOptions<Command.Options>({
	name: Types.Commands.Core.Ping,
	// todo
	description: 'Ping command',
	fullCategory: [Types.Commands.Category.Core],
	chatInputCommand: {
		register: true,
		// do it in json
		idHints: ['964521721531084881'],
		// do it with container
		guildIds: Config.client.testerGuilds,
		behaviorWhenNotIdentical: RegisterBehavior.Overwrite
	}
})
export class CoreCommand extends Command {
	async messageRun(message: Message) {
		const msg = await replyLocalized(message, Keys.Ping.Pinging);

		return editLocalized(msg, {
			keys: Keys.Ping.Success,
			formatOptions: {
				botLatency: Math.round(this.container.client.ws.ping),
				apiLatency: (msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp)
			}
		});
	}

	async chatInputRun(interaction: CommandInteraction) {
		// parse nn: await resolveKey(interaction.channel.<as-text-channel>, <key>)

		await interaction.deferReply(await resolveKey(interaction.channel as TextBasedChannel, Keys.Ping.Pinging));
		return interaction.editReply(
			await resolveKey(interaction.channel as TextBasedChannel, Keys.Ping.Success, {
				botLatency: Math.round(this.container.client.ws.ping),
				apiLatency: new Date().getTime() - interaction.createdTimestamp
			})
		);
	}
}
