import { Message } from "discord.js";
import DiscordBot from "@/DiscordBot";
import { BaseEvent, CommandContext, Deps } from "@/utils";

class MessageCreateEvent extends BaseEvent {
  constructor(private client = Deps.get<DiscordBot>(DiscordBot)) {
    super({
      on: "MESSAGE_CREATE",
      enabled: true
    });
  }

  async handle(msg: Message) {
    if (!msg.guild || !msg.member || msg.author.bot) return;

    let user = this.client.managers.cacheManager?.users.get(msg.author.id);
    let guild = this.client.managers.cacheManager?.guilds.get(msg.guild.id);

    if (!guild) {
      const guildLoadingMsg = await msg.reply(
        "Hey! This looks like a new guild. We configure a few settings about the guild!"
      );

      guild = await this.client.managers.databaseManager?.createGuild(
        msg.guild
      );
      await guildLoadingMsg.edit("Done!");
    }

    const prefix = guild!.prefix;

    if (msg.content.startsWith(prefix)) {
      const [command, ...commandArgs] = msg.content
          .toLowerCase()
          .slice(prefix.length)
          .trim()
          .split(/\s+/),
        cmd = this.client.managers.cacheManager?.commands.get(command);

      if (!cmd) return;

      if (!user) {
        const userLoadingMsg = await msg.reply(
          "Hey! This looks like your first command. We configure a few settings about you!"
        );

        user = await this.client.managers.databaseManager?.createUser(
          msg.author
        );
        await userLoadingMsg.edit("Done!");
      }

      if (cmd.options.onlyStaff && !user?.isStaff)
        return msg.reply("You are not a staff.");

      cmd.handle(new CommandContext(), msg, commandArgs);
    }
  }
}

export default MessageCreateEvent;
