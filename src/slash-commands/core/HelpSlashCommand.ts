import {
  CommandCategory,
  HelpSlashCommandComponent,
  SlashCommandCategory,
  SlashCommandK,
  SlashCommand
} from "@/utils";
import { CommandContext, ComponentType, SlashCreator } from "slash-create";
import { MessageEmbed, MessageEmbedOptions } from "discord.js";

class HelpSlashCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: SlashCommandK.HELP,
      category: SlashCommandCategory.CORE,
      description: "Help"
    });

    this.filePath = __filename;
  }

  async run(ctx: CommandContext) {
    await ctx.defer();

    await ctx.send("Which command category are you looking for?", {
      components: [
        {
          type: ComponentType.ACTION_ROW,
          components: [
            {
              type: ComponentType.SELECT,
              custom_id: HelpSlashCommandComponent.CustomID,
              placeholder: "Select a category you wish...",
              options: [
                {
                  label: "Core",
                  value: SlashCommandCategory.CORE,
                  description: "Core category"
                },
                {
                  label: "Staff",
                  value: SlashCommandCategory.STAFF,
                  description: "Staff category"
                }
              ]
            }
          ]
        }
      ]
    });

    ctx.registerComponent(
      HelpSlashCommandComponent.CustomID,
      async (selectCtx) => {
        const value = selectCtx.values[0] as SlashCommandCategory;
        const embed = new MessageEmbed({
          color: this.client.configs.Client.Colors.Brand,
          thumbnail: {
            url: this.client.user?.avatarURL()
          },
          footer: {
            icon_url: this.client.user?.avatarURL(),
            text: this.client.user?.username
          },
          timestamp: new Date()
        } as MessageEmbedOptions);

        switch (value) {
          case SlashCommandCategory.CORE:
            const coreCommands: string[] = Array.from(
              this.client.managers.cacheManager?.commands.values() ?? []
            )
              .filter((cmd) => cmd.options.category === CommandCategory.CORE)
              .map((cmd) => cmd.name);

            embed.setTitle("Commands of Core Category");
            embed.setDescription(
              coreCommands.length === 0
                ? "There is no command with this category."
                : coreCommands.length > 0
                ? `${coreCommands.map((name) => `\`${name}\``).join(", ")}`
                : `\`${coreCommands[0]}\``
            );

            await selectCtx.editParent({
              content: "You can change the category at below",
              embeds: [embed as any]
            });
            break;
          case SlashCommandCategory.STAFF:
            const staffCommands: string[] = Array.from(
              this.client.managers.cacheManager?.commands.values() ?? []
            )
              .filter((cmd) => cmd.options.category === CommandCategory.STAFF)
              .map((cmd) => cmd.name);

            embed.setTitle("Commands of Staff Category");
            embed.setDescription(
              staffCommands.length === 0
                ? "There is no command with this category."
                : staffCommands.length > 0
                ? `${staffCommands.map((name) => `\`${name}\``).join(", ")}`
                : `\`${staffCommands[0]}\``
            );

            await selectCtx.editParent({
              content: "You can change the category at below",
              embeds: [embed as any]
            });
            break;
          default:
            break;
        }
      }
    );
  }
}

export default HelpSlashCommand;
