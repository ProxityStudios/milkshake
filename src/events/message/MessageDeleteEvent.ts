import { Message, TextChannel } from "discord.js";
import { BaseEvent } from "@/utils";

class MessageDeleteEvent extends BaseEvent {
  constructor() {
    super({
      on: "MESSAGE_DELETE",
      enabled: true
    });
  }

  async handle(msg: Message) {
    const logChannel = msg.guild?.channels.cache.find(
      (c) => c.name === "audit-logs"
    ) as TextChannel | undefined;

    const fetchedLogs = await msg.guild?.fetchAuditLogs({
      limit: 1,
      type: "MESSAGE_DELETE"
    });

    const deletionLog = fetchedLogs?.entries.first();
    const notFoundMsg = `A message by ${msg.author.tag} was deleted. but we don't know by who.`;

    if (!deletionLog) return logChannel?.send(notFoundMsg);

    const { executor, target } = deletionLog;

    if (target.id === msg.author.id)
      logChannel?.send(
        `A message by ${msg.author.tag} was deleted by ${executor?.tag}.`
      );
    else logChannel?.send(notFoundMsg);
  }
}

export default MessageDeleteEvent;
