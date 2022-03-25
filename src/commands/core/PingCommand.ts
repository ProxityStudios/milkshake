import { BaseCommand, CommandContext } from "@/utils";
import { Message } from "discord.js";

class PingCommand extends BaseCommand {
  constructor() {
    super({
      name: "PING",
      enabled: true
    });
  }

  async handle(ctx: CommandContext, msg: Message): Promise<any> {
    const firstMsg = await msg.channel.send("Pinging...");

    await firstMsg.edit(
      `Pong: ${(firstMsg.createdTimestamp - msg.createdTimestamp).toFixed(0)}ms`
    );
  }
}

export default PingCommand;
