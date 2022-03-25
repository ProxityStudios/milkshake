import "module-alias/register";
import "dotenv/config";
import "reflect-metadata";

import { createConnection } from "typeorm";

import DiscordBot from "./DiscordBot";
import Configs from "./configs";
import { Deps } from "./utils";

(async function () {
  console.log("Connecting to database");
  await createConnection(Configs.Database);
  console.log("Connected to database");

  const client = Deps.add(
    DiscordBot,
    new DiscordBot({
      intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"]
    })
  );

  client.start();
})();
