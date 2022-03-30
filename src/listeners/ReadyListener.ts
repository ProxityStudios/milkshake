import { ApplyOptions } from '@sapphire/decorators';
import { Events, ListenerOptions, PieceContext } from '@sapphire/framework';
import { Listener, Store } from '@sapphire/framework';
import { blue, gray, green, magenta, magentaBright, white, yellow } from 'colorette';
import { Types } from '../lib';
import type { DatabaseService } from '../lib/structures/services';

const dev = process.env.NODE_ENV !== 'production';

@ApplyOptions<ListenerOptions>({
	event: Events.ClientReady,
	once: true
})
export class UserEvent extends Listener<typeof Events.ClientReady> {
	private readonly style = dev ? yellow : blue;

	constructor(context: PieceContext, options?: ListenerOptions) {
		super(context, {
			...options,
			once: true
		});
	}

	async run() {
		this.printBanner();
		this.printStoreDebugInformation();

		for (const guild of this.container.client.guilds.cache.map((g) => g)) {
			const appGuildRepo = this.container.services.get<DatabaseService>(Types.Service.DatabaseService).repos[0].guilds!;

			const isExists = await appGuildRepo.findOneBy({
				id: guild.id
			});

			if (isExists) return;

			const newGuild = appGuildRepo.create({
				id: guild.id,
				language: 'en-US'
			});
			await appGuildRepo.save(appGuildRepo.create(newGuild));
		}
	}

	printBanner() {
		const success = green('+');

		const llc = dev ? magentaBright : white;
		const blc = dev ? magenta : blue;

		const line01 = llc('');
		const line02 = llc('');
		const line03 = llc('');

		// Offset Pad
		const pad = ' '.repeat(7);

		console.log(
			String.raw`
${blc(this.container.client.user?.username.toUpperCase()!)}
${line01} ${pad}${blc(this.container.config.version)}
${line02} ${pad}[${success}] Gateway
${line03}${dev ? ` ${pad}${blc('<')}${llc('/')}${blc('>')} ${llc('DEVELOPMENT MODE')}` : ''}
		`.trim()
		);
	}

	private printStoreDebugInformation() {
		const { client, logger } = this.container;
		const stores = [...client.stores.values()];
		const last = stores.pop()!;

		for (const store of stores) logger.info(this.styleStore(store, false));
		logger.info(this.styleStore(last, true));
	}

	private styleStore(store: Store<any>, last: boolean) {
		return gray(`${last ? '└─' : '├─'} Loaded ${this.style(store.size.toString())} ${store.name}.`);
	}
}
