import { ConnectionOptions } from "typeorm";
import { entities } from "@/utils/typeorm";
import { SlashCreatorOptions } from "slash-create";

const Configs = {
  Client: {
    Version: "0.8.7",
    Managers: {
      Enabled: {},
      CacheManager: {},
      DatabaseManager: {},
      SlashCreatorManager: {
        publicKey: process.env.DISCORD_APP_PUBLIC_KEY,
        token: process.env.DISCORD_APP_TOKEN
      } as SlashCreatorOptions
    },
    OwnerIDs: ["748366237788012695"],
    Colors: {
      Brand: "ffb48f"
    },
    URLs: {
      Home: "https://www.proxitystudios.tk/project/milkshake-bot"
    }
  },
  Database: {
    type: "mysql",
    host: process.env.MYSQL_DATABASE_HOST,
    port: Number(process.env.MYSQL_DATABASE_PORT),
    username: process.env.MYSQL_DATABASE_USERNAME,
    password: process.env.MYSQL_DATABASE_PASSWORD,
    database: process.env.MYSQL_DATABASE_NAME,
    entities,
    synchronize: true
  } as ConnectionOptions
};

export default Configs;
