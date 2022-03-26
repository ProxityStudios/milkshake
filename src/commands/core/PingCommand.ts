import { BaseCommand, Command, CommandCategory, CommandContext } from "@/utils";
import { Message } from "discord.js";

class PingCommand extends BaseCommand {
  constructor() {
    super({
      enabled: true,
      name: Command.PING,
      category: CommandCategory.CORE
    });
  }

  async handle(ctx: CommandContext, msg: Message): Promise<any> {
    const firstMsg = await msg.channel.send("Checking message latency...");

    await firstMsg.edit(
      `Message Latency: \`${(
        firstMsg.createdTimestamp - msg.createdTimestamp
      ).toFixed(0)}ms\``
    );
  }
}

export default PingCommand;
