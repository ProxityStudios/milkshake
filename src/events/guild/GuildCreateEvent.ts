import { Guild } from "discord.js";

import DiscordBot from "@/DiscordBot";
import { BaseEvent, Deps } from "@/utils";

class GuildCreateEvent extends BaseEvent {
  constructor(private client = Deps.get<DiscordBot>(DiscordBot)) {
    super({
      on: "GUILD_CREATE",
      enabled: true
    });
  }

  async handle(guild: Guild) {
    console.log("Joined to:", guild.id);

    const svdGuild = await this.client.repos.guilds.findOne(guild.id);

    if (svdGuild) {
      this.client.managers.cacheManager?.cacheGuild(svdGuild);
      await guild.systemChannel?.send(
        `Good to see you again guys! Type \`${svdGuild.prefix}support-center\` to visit support center!`
      );
      return;
    }

    const savedGuild = await this.client.managers.databaseManager?.createGuild(
      guild
    );

    await guild.systemChannel?.send(
      `Hey I'm new here, Type \`${savedGuild?.prefix}help\` to learn my commands`
    );
  }
}

export default GuildCreateEvent;
