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
    if (!msg.guild || msg.author.bot) return;

    let user = this.client.cacheManager?.users.get(msg.author.id);
    let guild = this.client.cacheManager?.guilds.get(msg.guild.id);

    if (!user) {
      await msg.reply(
        "Hey! This looks like your first command. We configure a few settings about you!"
      );

      const isOwner = this.client.configs.Client.OwnerIDs.includes(
        msg.author.id
      );

      const newUser = this.client.repos.users.create({
          id: msg.author.id,
          name: msg.author.username,
          isStaff: isOwner
        }),
        savedUser = await this.client.repos.users.save(newUser);
      user = this.client.cacheManager?.cacheUser(savedUser);
    }

    if (!guild) {
      await msg.reply(
        "Hey! This looks like a new guild. We configure a few settings about the guild!"
      );

      const newGuild = this.client.repos.guilds.create({
          id: msg.guild.id,
          name: msg.guild.name
        }),
        savedGuild = await this.client.repos.guilds.save(newGuild);
      guild = this.client.cacheManager?.cacheGuild(savedGuild);
    }

    const prefix = guild!.prefix;

    if (msg.content.startsWith(prefix)) {
      const [command, ...commandArgs] = msg.content
          .toLowerCase()
          .slice(prefix.length)
          .trim()
          .split(/\s+/),
        cmd = this.client.cacheManager?.commands.get(command);

      // console.log(this.client.cacheManager?.commands);

      if (!cmd) return;

      if (cmd.options.onlyStaff && !user?.isStaff)
        return msg.reply("You are not a staff.");

      cmd.handle(new CommandContext(), msg, commandArgs);
    }
  }
}

export default MessageCreateEvent;
