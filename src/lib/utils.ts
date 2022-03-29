import { send } from '@sapphire/plugin-editable-commands';
import { isNullishOrEmpty } from '@sapphire/utilities';
import { Message, MessageEmbed } from 'discord.js';
import { LoadingMessages } from './constants';

export function envParseArray(key: 'OWNERS', defaultValue?: string[]): string[] {
	const value = process.env[key];
	if (isNullishOrEmpty(value)) {
		if (defaultValue === undefined) throw new Error(`[ENV] ${key} - The key must be an array, but is empty or undefined.`);
		return defaultValue;
	}

	return value.split(' ');
}

export function envParseString(key: 'DISCORD_APP_TOKEN', defaultValue?: string): string {
	const value = process.env[key];
	if (isNullishOrEmpty(value)) {
		if (defaultValue === undefined) throw new Error(`[ENV] ${key} - The key must be an string, but is empty or undefined.`);
		return defaultValue;
	}

	return value;
}


/**
 * Picks a random item from an array
 * @param array The array to pick a random item from
 * @example
 * const randomEntry = pickRandom([1, 2, 3, 4]) // 1
 */
export function pickRandom<T>(array: readonly T[]): T {
	const { length } = array;
	return array[Math.floor(Math.random() * length)];
}

/**
 * Sends a loading message to the current channel
 * @param message The message data for which to send the loading message
 */
export function sendLoadingMessage(message: Message): Promise<typeof message> {
	return send(message, { embeds: [new MessageEmbed({ description: pickRandom(LoadingMessages) })] });
}
