import { BaseCommand, CommandContext } from "@/utils";
import { Message } from "discord.js";

class HelpCommand extends BaseCommand {
  constructor() {
    super({
      name: "HELP",
      enabled: true
    });
  }

  async handle(ctx: CommandContext, msg: Message): Promise<any> {
    await msg.reply(ctx.configs.Client.URLs.Home);
  }
}

export default HelpCommand;
