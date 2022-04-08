import { ApplyOptions } from '@sapphire/decorators';
import { CommandDeniedPayload, Events } from '@sapphire/framework';
import { Listener, UserError } from '@sapphire/framework';
import { reply } from '@sapphire/plugin-editable-commands';

@ApplyOptions<Listener.Options>({
	event: Events.CommandDenied
})
export class CommandEvent extends Listener<typeof Events.CommandDenied> {
	async run({ context, message: content }: UserError, { message }: CommandDeniedPayload) {
		if (Reflect.get(Object(context), 'silent')) return;

		return reply(message, { content, allowedMentions: { users: [message.author.id], roles: [] } });
	}
}
