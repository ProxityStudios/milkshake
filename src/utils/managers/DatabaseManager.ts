import DiscordBot from "@/DiscordBot";
import { Guild, User } from "discord.js";
import { BaseManager, Repositories } from "../defs";
import { GuildEntity } from "../typeorm/entities/GuildEntity";
import { UserEntity } from "../typeorm/entities/UserEntity";

export class DatabaseManager extends BaseManager {
  private repos: Repositories;

  constructor(protected client: DiscordBot) {
    super();
    this.repos = this.client.repos;
  }

  async init(): Promise<void> {
    console.log("Nothing to load in database manager");
  }

  async createGuild(guild: Guild): Promise<GuildEntity> {
    const savedGuild = await this.repos.guilds.findOne(guild.id);

    if (!savedGuild) {
      const newGuild = this.repos.guilds.create({
        id: guild.id,
        name: guild.name
      });

      const svdGuild = await this.repos.guilds.save(newGuild);
      this.client.managers.cacheManager?.cacheGuild(svdGuild);

      console.log("Guild saved:", guild.id);

      return svdGuild;
    } else {
      throw new Error(
        `Guild with id ${guild.id} found in database, createGuild() aborted.`
      );
    }
  }

  async createUser(user: User): Promise<UserEntity> {
    const savedUser = await this.repos.users.findOne(user.id);

    if (!savedUser) {
      const isOwner = this.client.configs.Client.OwnerIDs.includes(user.id);

      const newUser = this.repos.users.create({
        id: user.id,
        name: user.username,
        isStaff: isOwner
      });

      const svdUser = await this.repos.users.save(newUser);
      this.client.managers.cacheManager?.cacheUser(svdUser);

      console.log("User saved:", user.id);

      return svdUser;
    } else {
      throw new Error(
        `User with id ${user.id} found in database, createUser() aborted.`
      );
    }
  }
}
