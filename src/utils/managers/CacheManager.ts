import DiscordBot from "@/DiscordBot";
import { GuildEntity } from "../typeorm/entities/GuildEntity";
import { UserEntity } from "../typeorm/entities/UserEntity";
import { BaseCommand, BaseEvent } from "..";
import { BaseManager } from "../defs";

export class CacheManager extends BaseManager {
  guilds = new Map<string, GuildEntity>();
  events = new Map<string, BaseEvent>();
  commands = new Map<string, BaseCommand>();
  users = new Map<string, UserEntity>();

  constructor(protected client: DiscordBot) {
    super();
  }

  async init(): Promise<void> {
    console.log("Loading cache manager...");

    const savedGuilds = await this.client.repos.guilds.find(),
      savedUsers = await this.client.repos.users.find(),
      { commands, events } = this.client.files;

    events.map((event) => this.cacheEvent(event));
    commands.map((command) => this.cacheCommand(command));
    savedGuilds.map((guild) => this.cacheGuild(guild));
    savedUsers.map((user) => this.cacheUser(user));

    console.log(
      `${this.guilds.size} guilds, ${this.users.size} users, ${this.commands.size} commands and ${this.events.size} events are cached`
    );
  }

  cacheGuild(guild: GuildEntity): GuildEntity {
    console.log("Guild cached:", guild.id);
    return this.guilds.set(guild.id, guild).get(guild.id)!;
  }

  cacheUser(user: UserEntity): UserEntity {
    console.log("User cached:", user.id);
    return this.users.set(user.id, user).get(user.id)!;
  }

  cacheCommand(command: BaseCommand): BaseCommand {
    // console.log("Command cached:", command.name);
    return this.commands.set(command.name, command).get(command.name)!;
  }

  cacheEvent(event: BaseEvent): BaseEvent {
    // console.log("Event cached:", event.on);
    return this.events.set(event.on, event).get(event.on)!;
  }
}
