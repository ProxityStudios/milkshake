import { BaseEvent, Deps } from "@/utils";
import DiscordBot from "@/DiscordBot";

class ReadyEvent extends BaseEvent {
  constructor(private client = Deps.get<DiscordBot>(DiscordBot)) {
    super({
      on: "CLIENT_READY",
      enabled: true
    });
  }

  async handle(...args: any) {
    console.log("Signed in as " + this.client.user?.tag);
  }
}

export default ReadyEvent;
