const path = 'commands/admin/prefix:';
const parseKey = (key: string) => path + key;

export const Prefix = {
	Current: parseKey('CURRENT'),
	Reset: {
		Success: parseKey('RESET.SUCCESS')
	},
	Set: {
		Success: parseKey('SET.SUCCESS')
	}
};
