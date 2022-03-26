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

  async start(skipFiles: boolean = false): Promise<void> {
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
      console.log("RETRYING TO CONNECT DISCORD IN 4 SECONDS...");
      setTimeout(() => {
        this.start(true);
      }, 4000);
    }

    // initialise managers
    await this.initManagers();
  }

  private async initManagers(): Promise<void> {
    this.managers = {
      cacheManager: Deps.add(CacheManager, new CacheManager(this)),
      databaseManager: Deps.add(DatabaseManager, new DatabaseManager(this))
    };

    this.cacheManager = this.managers.cacheManager;
    await this.managers.cacheManager?.init();
    await this.managers.databaseManager?.init();
  }
}

export default DiscordBot;
