import { BaseCommand, Command, CommandCategory, CommandContext } from "@/utils";
import { Message } from "discord.js";

class HelpCommand extends BaseCommand {
  constructor() {
    super({
      enabled: true,
      name: Command.HELP,
      category: CommandCategory.CORE
    });
  }

  async handle(ctx: CommandContext, msg: Message): Promise<any> {
    await msg.reply(ctx.configs.Client.URLs.Home);
  }
}

export default HelpCommand;
