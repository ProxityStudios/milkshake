import { Client } from "discord.js";

import {
  registerCommands,
  registerEvents,
  CacheManager,
  Deps,
  DatabaseManager
} from "@/utils";
import Configs from "@/configs";
import { ClientFiles, Managers, Repositories } from "./utils/defs";
import { getRepository } from "typeorm";
import { GuildEntity } from "./utils/typeorm/entities/GuildEntity";
import { UserEntity } from "./utils/typeorm/entities/UserEntity";

class DiscordBot extends Client {
  readonly configs = Configs;

  repos: Repositories = {
    guilds: getRepository(GuildEntity),
    users: getRepository(UserEntity)
  };

  // shortcuts
  managers: Managers = {};

  /**
   * @deprecated use `managers.cacheManager` instead of this
   */
  cacheManager?: CacheManager;

  connected: boolean;

  // files
  files: ClientFiles = {
    events: [],
    commands: []
  };

  async start(skipFiles?: boolean): Promise<void> {
    if (!skipFiles) {
      this.files.events = await registerEvents(this, "../events");
      this.files.commands = await registerCommands(this, "../commands");
    }

    // log in to the app
    try {
      console.log("Connecting to discord");
      await this.login(process.env.DISCORD_APP_TOKEN);
      console.log("Connected to discord");
      this.connected = true;
    } catch (e) {
      console.error(e);
      this.connected = false;
    }

    if (!this.connected) {
      console.error("FAILED TO CONNECT DISCORD!");
      console.log("RETRYING TO CONNECT DISCORD...");
      this.start(true);
    }

    // initialise managers
    this.initManagers();
  }

  private initManagers(): void {
    this.managers = {
      cacheManager: Deps.add(CacheManager, new CacheManager(this)),
      databaseManager: Deps.add(DatabaseManager, new DatabaseManager(this))
    };

    this.cacheManager = this.managers.cacheManager;
    this.managers.cacheManager?.init();
    this.managers.databaseManager?.init();
  }
}

export default DiscordBot;
