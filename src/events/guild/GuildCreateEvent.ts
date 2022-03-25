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

  async handle({ id, systemChannel, name }: Guild) {
    console.log("Joined to:", id);

    const cachedGuild = this.client.cacheManager?.guilds.get(id);

    if (cachedGuild) {
      systemChannel?.send("Hey good to see you again guys");
      this.client.cacheManager?.guilds.set(cachedGuild.id, cachedGuild);
      return console.log("Guild exists:", cachedGuild.id);
    }

    systemChannel?.send("Hey I'm new here");

    const newGuild = this.client.repos.guilds.create({
        id,
        name
      }),
      savedGuild = await this.client.repos.guilds.save(newGuild);

    this.client.cacheManager?.cacheGuild(savedGuild);
    console.log("Guild saved:", savedGuild.id);
  }
}

export default GuildCreateEvent;
