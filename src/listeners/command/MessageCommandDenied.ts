import { ApplyOptions } from '@sapphire/decorators';
import { MessageCommandDeniedPayload, Events } from '@sapphire/framework';
import { Listener, UserError } from '@sapphire/framework';
import { reply } from '@sapphire/plugin-editable-commands';

@ApplyOptions<Listener.Options>({
	event: Events.MessageCommandDenied
})
export class CommandEvent extends Listener<typeof Events.MessageCommandDenied> {
	async run({ context, message: content }: UserError, { message }: MessageCommandDeniedPayload) {
		if (Reflect.get(Object(context), 'silent')) return;

		return reply(message, { content, allowedMentions: { users: [message.author.id], roles: [] } });
	}
}
