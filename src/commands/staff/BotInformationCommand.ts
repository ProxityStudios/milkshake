import { BaseCommand, CommandContext } from "@/utils";
import { Message, MessageEmbed, MessageEmbedOptions } from "discord.js";
import app from "../../../package.json";

class BotInformationCommand extends BaseCommand {
  constructor() {
    super({
      name: "BOT_INFORMATION",
      enabled: true,
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
          Version: \`${app.version}\`
          Uptime: \`${uptime === 0 ? "a few seconds" : uptime + " minutes"}\``
        },
        {
          name: "Statistics",
          value: `
          Guilds: \`${ctx.managers.cacheManager?.guilds.size}/${guildCount}/${ctx.client.guilds.cache.size}\` *(cached/saved/total)* 
          Users: \`${ctx.managers.cacheManager?.users.size}/${userCount}/${ctx.client.users.cache.size}\` *(cached/saved/total)* 
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
