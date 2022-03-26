import { BaseCommand, Command, CommandCategory, CommandContext } from "@/utils";
import { Message } from "discord.js";

class CompanyCommand extends BaseCommand {
  constructor() {
    super({
      enabled: true,
      name: Command.COMPANY,
      category: CommandCategory.CORE
    });
  }

  async handle(ctx: CommandContext, msg: Message): Promise<any> {
    await msg.reply("Use slash command instead of this");
  }
}

export default CompanyCommand;
