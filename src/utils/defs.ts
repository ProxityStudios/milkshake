import { ClientEvents, Constants, ConstantsEvents, Message } from "discord.js";
import { Repository } from "typeorm";
import DiscordBot from "@/DiscordBot";
import { CacheManager, Deps } from "./";
import { GuildEntity } from "./typeorm/entities/GuildEntity";
import { UserEntity } from "./typeorm/entities/UserEntity";
import { DatabaseManager } from "./managers";

export enum Command {
  PING = "ping",
  HELP = "help",
  BOT_INFORMATION = "bot-info"
}

export interface CommandOptions {
  name: keyof typeof Command;
  enabled: boolean;
  onlyStaff?: boolean;
}

export interface EventOptions {
  on: keyof ConstantsEvents;
  enabled: boolean;
}

export type Managers = {
  [key: string]: BaseManager | undefined;

  cacheManager?: CacheManager;
  databaseManager?: DatabaseManager;
};

export type ClientCache = {
  [key: string]: any;

  guilds: Map<string, GuildEntity>;
};

export type ClientFiles = {
  [key: string]: any;

  events: BaseEvent[];
  commands: BaseCommand[];
};

export type Repositories = {
  [key: string]: Repository<any>;

  guilds: Repository<GuildEntity>;
  users: Repository<UserEntity>;
};

export abstract class BaseManager {
  constructor(
    protected client: DiscordBot = Deps.get<DiscordBot>(DiscordBot)
  ) {}

  abstract init(...args: any): any;
}

export abstract class BaseEvent {
  constructor(public options: EventOptions) {}

  abstract handle(...args: any): any;

  get on(): keyof ClientEvents {
    return Constants.Events[this.options.on] as keyof ClientEvents;
  }
}

export abstract class BaseCommand {
  constructor(public options: CommandOptions) {}

  abstract handle(ctx: CommandContext, msg: Message, ...args: any): any;

  get name(): Command {
    return Command[this.options.name];
  }
}

export class CommandContext {
  constructor(public client = Deps.get<DiscordBot>(DiscordBot)) {}

  get managers(): Managers {
    return this.client.managers;
  }

  get colors() {
    return this.client.configs.Client.Colors;
  }

  get configs() {
    return this.client.configs;
  }

  get repos(): Repositories {
    return this.client.repos;
  }
}
