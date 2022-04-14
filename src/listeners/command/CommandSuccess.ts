import { ApplyOptions } from '@sapphire/decorators';
import type { CommandSuccessPayload } from '@sapphire/framework';
import { Command, Events, Listener, LogLevel } from '@sapphire/framework';
import type { Logger } from '@sapphire/plugin-logger';
import type { Guild, User } from 'discord.js';

@ApplyOptions<Listener.Options>({
	event: Events.CommandSuccess
})
export class CommandEvent extends Listener<typeof Events.CommandSuccess> {
	run({ message, command }: CommandSuccessPayload) {
		const shard = this.shard(message.guild?.shardId ?? 0);
		const commandName = this.command(command);
		const author = this.author(message.author);
		const sentAt = message.guild ? this.guild(message.guild) : this.direct();
		this.container.logger.debug(`${shard} > ${commandName} ${author} ${sentAt}`);
	}

	onLoad() {
		this.enabled = (this.container.logger as Logger).level <= LogLevel.Debug;
		return super.onLoad();
	}

	private shard(id: number) {
		return `[${this.container.colorette.cyan(id.toString())}]`;
	}

	private command(command: Command) {
		return this.container.colorette.cyan(command.name);
	}

	private author(author: User) {
		return `${author.username}[${this.container.colorette.cyan(author.id)}]`;
	}

	private direct() {
		return this.container.colorette.cyan('Direct Messages');
	}

	private guild(guild: Guild) {
		return `${guild.name}[${this.container.colorette.cyan(guild.id)}]`;
	}
}
