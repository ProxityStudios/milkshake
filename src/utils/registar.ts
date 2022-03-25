import path from "path";
import { promises as fs } from "fs";

import DiscordBot from "@/DiscordBot";
import { BaseCommand, BaseEvent } from "./defs";

const events: BaseEvent[] = [],
  commands: BaseCommand[] = [];

export async function registerEvents(
  client: DiscordBot,
  dir: string
): Promise<BaseEvent[]> {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);

  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));

    // if its a dir, register files in the dir
    if (stat.isDirectory()) registerEvents(client, path.join(dir, file));

    if (file.endsWith(".js")) {
      const { default: Event } = await import(path.join(dir, file));
      const event: BaseEvent = new Event();

      if (!event.options.enabled) continue;

      events.push(event);
      client.on(event.on, event.handle.bind(event));
    }
  }

  return events;
}

export async function registerCommands(
  client: DiscordBot,
  dir: string
): Promise<BaseCommand[]> {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);

  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));

    // if its a dir, register files in the dir
    if (stat.isDirectory()) registerCommands(client, path.join(dir, file));

    if (file.endsWith(".js")) {
      const { default: Command } = await import(path.join(dir, file));
      const command: BaseCommand = new Command();

      if (!command.options.enabled) continue;
      commands.push(command);
    }
  }

  return commands;
}
