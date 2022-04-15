const path = 'commands/core/ping:';
const parseKey = (key: string) => path + key;

export const Ping = {
	Pinging: parseKey('PINGING'),
	Success: parseKey('SUCCESS')
};
