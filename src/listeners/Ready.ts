import { ApplyOptions } from '@sapphire/decorators';
import { Events } from '@sapphire/framework';
import { Listener, Store } from '@sapphire/framework';

@ApplyOptions<Listener.Options>({
	event: Events.ClientReady,
	once: true
})
export class ClientEvent extends Listener<typeof Events.ClientReady> {
	private readonly style = this.container.config.dev ? this.container.colorette.yellow : this.container.colorette.blue;

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
		return this.container.colorette.gray(`${last ? '└─' : '├─'} Loaded ${this.style(store.size.toString())} ${store.name}.`);
	}
}
