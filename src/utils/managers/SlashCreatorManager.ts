import DiscordBot from "@/DiscordBot";
import { BaseManager } from "../defs";
import { GatewayServer, SlashCreator } from "slash-create";
import { join } from "path";

export class SlashCreatorManager extends BaseManager {
  constructor(protected client: DiscordBot, private creator: SlashCreator) {
    super();
  }

  async init(): Promise<void> {
    console.log("Loading slash creator manager...");

    this.creator
      .withServer(
        new GatewayServer((handler) =>
          this.client.ws.on("INTERACTION_CREATE", handler)
        )
      )
      .registerCommandsIn(join(__dirname, "..", "..", "slash-commands"))
      .syncCommands({
        deleteCommands: true,
        syncPermissions: true
      });

    console.log("Slash creator manager loaded");
  }
}
