import { ApplyOptions } from '@sapphire/decorators';
import { Events, ListenerOptions, container } from '@sapphire/framework';
import { Listener, Store } from '@sapphire/framework';
import { blue, gray, yellow } from 'colorette';

const APP_MODE = container.utils.envParseString('NODE_ENV', 'development');

@ApplyOptions<ListenerOptions>({
	event: Events.ClientReady,
	once: true
})
export class ClientEvent extends Listener<typeof Events.ClientReady> {
	private readonly style = APP_MODE === 'development' ? yellow : blue;

	run() {
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
