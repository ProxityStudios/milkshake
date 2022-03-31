import { send } from '@sapphire/plugin-editable-commands';
import { isClass, isNullishOrEmpty } from '@sapphire/utilities';
import { Message, MessageEmbed } from 'discord.js';
import { getAllFilesSync } from 'get-all-files';
import type { Types } from '.';
import { LoadingMessages } from './constants';

export function loadServices(folder: string, map: Types.Services): Promise<typeof map> {
	const services: Types.BaseService[] = [];
	let sortedServicesByPriority: typeof services = [];

	return new Promise<typeof map>(async (res) => {
		for await (const filename of getAllFilesSync(folder).toArray()) {
			if (!filename.endsWith('js')) continue;

			const { default: Service } = await import(filename);

			if (!isClass(Service)) continue;

			const instance: Types.BaseService = new Service();

			if (instance.options.disabled) continue;

			services.push(instance);
		}

		sortedServicesByPriority = services
			.sort((a, b) => {
				if (a.options.priority > b.options.priority) {
					return 1;
				} else if (a.options.priority! < b.options.priority!) {
					return -1;
				}
				return 0;
			})
			.reverse();

		sortedServicesByPriority.forEach(async (instance) => {
			await instance.run();
			map.set(instance.name, instance);
		});

		res(map);
	});
}

// add types
export function envParseArray(key: string, defaultValue?: string[]): string[] {
	const value = process.env[key];

	if (isNullishOrEmpty(value)) {
		if (defaultValue === undefined) throw new Error(`[ENV] ${key} - The key must be an array, but is empty or undefined.`);
		return defaultValue;
	}

	return value.split(' ');
}

// add types
export function envParseString(key: string, defaultValue?: string): string {
	const value = process.env[key];

	if (isNullishOrEmpty(value)) {
		if (defaultValue === undefined) throw new Error(`[ENV] ${key} - The key must be an string, but is empty or undefined.`);
		return defaultValue;
	}

	return value;
}

// add types
export function envParseInteger(key: string, defaultValue?: number): number {
	const value = Number(process.env[key]);

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
