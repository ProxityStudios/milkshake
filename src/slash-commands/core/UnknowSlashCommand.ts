import { CommandContext, SlashCommand, SlashCreator } from "slash-create";

class UnknowSlashCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: "unknow",
      unknown: true
    });

    this.filePath = __filename;
  }

  async run(ctx: CommandContext) {
    return "Unknow slash command.";
  }
}

export default UnknowSlashCommand;
