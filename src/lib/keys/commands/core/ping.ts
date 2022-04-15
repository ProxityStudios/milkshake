const path = 'commands/core/ping:';
const parseKey = (key: string) => path + key;

export const Ping = {
	Pinging: parseKey('PINGING'),
	Success: parseKey('SUCCESS'),
	Type: {
		Bot: {
			Success: parseKey('TYPE.BOT.SUCCESS')
		},
		API: {
			Success: parseKey('TYPE.API.SUCCESS')
		}
	}
};
