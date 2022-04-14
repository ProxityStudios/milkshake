const path = 'commands/admin/language:';
const parseKey = (key: string) => path + key;

export const Language = {
	Current: parseKey('CURRENT'),
	Reset: {
		Success: parseKey('RESET.SUCCESS')
	},
	Set: {
		Success: parseKey('SET.SUCCESS'),
		InvalidLanguage: parseKey('SET.INVALID_LANG')
	}
};
