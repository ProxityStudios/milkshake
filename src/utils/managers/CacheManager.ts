import DiscordBot from "@/DiscordBot";
import { GuildEntity } from "../typeorm/entities/GuildEntity";
import { UserEntity } from "../typeorm/entities/UserEntity";
import { BaseCommand, BaseEvent } from "..";

export class CacheManager {
  guilds = new Map<string, GuildEntity>();
  events = new Map<string, BaseEvent>();
  commands = new Map<string, BaseCommand>();
  users = new Map<string, UserEntity>();

  constructor(protected client: DiscordBot) {}

  async init(initialCaching?: boolean): Promise<void> {
    console.log("Loading cache manager...");

    if (initialCaching) {
      console.log("Loading initial cache");

      const savedGuilds = await this.client.repos.guilds.find(),
        savedUsers = await this.client.repos.users.find(),
        { commands, events } = this.client.files;

      savedGuilds.map((guild) => this.cacheGuild(guild));
      savedUsers.map((user) => this.cacheUser(user));
      events.map((event) => this.cacheEvent(event));
      commands.map((command) => this.cacheCommand(command));

      console.log(
        `${this.guilds.size} guilds, ${this.users.size} users, ${this.commands.size} commands and ${this.events.size} events are cached`
      );
    } else {
      console.warn("Initial caching skipped");
    }
  }

  cacheGuild(guild: GuildEntity): GuildEntity {
    return (
      this.guilds.get(guild.id) ??
      this.guilds.set(guild.id, guild).get(guild.id)!
    );
  }

  cacheUser(user: UserEntity): UserEntity {
    return (
      this.users.get(user.id) ?? this.users.set(user.id, user).get(user.id)!
    );
  }

  cacheCommand(command: BaseCommand): BaseCommand {
    return (
      this.commands.get(command.name) ??
      this.commands.set(command.name, command).get(command.name)!
    );
  }

  cacheEvent(event: BaseEvent): BaseEvent {
    return (
      this.events.get(event.on) ??
      this.events.set(event.on, event).get(event.on)!
    );
  }
}
