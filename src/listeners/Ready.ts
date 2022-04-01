import { ApplyOptions } from '@sapphire/decorators';
import { Events, ListenerOptions, PieceContext } from '@sapphire/framework';
import { Listener, Store } from '@sapphire/framework';
import { blue, gray, yellow } from 'colorette';
import { Utils } from '../lib';

const APP_MODE = Utils.envParseString('NODE_ENV', 'development');

@ApplyOptions<ListenerOptions>({
	event: Events.ClientReady,
	once: true
})
export class UserEvent extends Listener<typeof Events.ClientReady> {
	private readonly style = APP_MODE === 'development' ? yellow : blue;

	constructor(context: PieceContext, options?: ListenerOptions) {
		super(context, {
			...options,
			once: true
		});
	}

	async run() {
		this.printStoreDebugInformation();
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
