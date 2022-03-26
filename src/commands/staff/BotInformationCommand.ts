import { BaseCommand, Command, CommandCategory, CommandContext } from "@/utils";
import { Message, MessageEmbed, MessageEmbedOptions } from "discord.js";

class BotInformationCommand extends BaseCommand {
  constructor() {
    super({
      enabled: true,
      name: Command.BOT_INFORMATION,
      category: CommandCategory.STAFF,
      onlyStaff: true
    });
  }

  async handle(ctx: CommandContext, msg: Message) {
    const loadingMsg = await msg.reply("Loading data...");

    const guildCount = await ctx.repos.guilds.count(),
      userCount = await ctx.repos.users.count(),
      uptime = Math.floor(process.uptime() / 60);

    const infoEmbed = new MessageEmbed({
      title: "Bot Information",
      description: "Some info of the bot are shown below",
      color: ctx.colors.Brand,
      thumbnail: {
        url: ctx.client.user?.avatarURL() ?? ""
      },
      fields: [
        {
          name: "Client",
          value: `
          Version: \`${ctx.configs.Client.Version}\`
          Uptime: \`${uptime === 0 ? "a few seconds" : uptime + " minutes"}\``
        },
        {
          name: "Statistics",
          value: `
          Guilds: \`${ctx.managers.cacheManager?.guilds.size}/${guildCount}/${ctx.client.guilds.cache.size}\` *(cached/saved/current)* 
          Users: \`${ctx.managers.cacheManager?.users.size}/${userCount}/${ctx.client.users.cache.size}\` *(cached/saved/current)* 
          `
        }
      ],
      footer: {
        icon_url: msg.author.avatarURL() ?? "",
        text: msg.author.tag + " | Staff"
      },
      timestamp: new Date()
    } as MessageEmbedOptions);

    await loadingMsg.edit({
      content: `Done in ${(
        loadingMsg.createdTimestamp - msg.createdTimestamp
      ).toFixed(0)}ms`,
      embeds: [infoEmbed]
    });
  }
}

export default BotInformationCommand;
