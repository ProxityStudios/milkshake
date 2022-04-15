import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, RegisterBehavior } from '@sapphire/framework';
import { editLocalized, replyLocalized, resolveKey } from '@sapphire/plugin-i18next';
import type { CommandInteraction, Message } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

import { Keys, Types, Utils } from '../../lib';

@ApplyOptions<Command.Options>({
	name: Types.Commands.Core.Ping,
	// todo
	description: 'Ping command',
	fullCategory: [Types.Commands.Category.Core]
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

		const type = interaction.options.getString('type');

		// make it with types
		switch (type) {
			case 'bot':
				this.runCommandForTypeBot(interaction);
				break;
			case 'api':
				this.runCommandForTypeApi(interaction);
				break;
		}
	}

	async runCommandForTypeBot(interaction: CommandInteraction) {
		return interaction.reply(
			await resolveKey(interaction.channel!, Keys.Ping.Type.Bot.Success, {
				botLatency: Math.round(this.container.client.ws.ping)
			})
		);
	}

	async runCommandForTypeApi(interaction: CommandInteraction) {
		return interaction.reply(
			await resolveKey(interaction.channel!, Keys.Ping.Type.API.Success, {
				apiLatency: interaction.createdTimestamp - new Date().getTime()
			})
		);
	}

	async registerApplicationCommands(registry: ApplicationCommandRegistry) {
		const builder = new SlashCommandBuilder();

		builder.setName(this.name);
		builder.setDescription(this.description);

		builder.addStringOption((input) =>
			input
				.setName('type')
				.setDescription('Type')
				.addChoices([
					// make it with types
					['Bot', 'bot'],
					['API', 'api']
				])
				.setRequired(true)
		);

		const options: ApplicationCommandRegistry.RegisterOptions = {
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
			registerCommandIfMissing: true,
			idHints: await Utils.getIDHintsOfSlashCommand(Types.Commands.Core.Ping)
			// guildIds: this.container.config.dev ? this.container.config.client.testerGuilds : []
		};

		if (this.container.config.dev) {
			options.guildIds = this.container.config.client.testerGuilds;
		}

		registry.registerChatInputCommand(builder, options);
	}
}
