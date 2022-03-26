import { SlashCommandCategory, SlashCommandK, SlashCommand } from "@/utils";
import { CommandContext, SlashCreator } from "slash-create";

class PingSlashCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: SlashCommandK.PING,
      category: SlashCommandCategory.CORE,
      description: "Ping"
    });

    this.filePath = __filename;
  }

  async run(ctx: CommandContext) {
    const firstMsg = await ctx.sendFollowUp("Checking interaction latency...");
    const editedMessage = await firstMsg.edit("A few more seconds...");

    await editedMessage.edit(
      `Interaction Latency: \`${(
        editedMessage.editedTimestamp! - firstMsg.timestamp
      ).toFixed(0)}ms\``
    );
  }
}

export default PingSlashCommand;
