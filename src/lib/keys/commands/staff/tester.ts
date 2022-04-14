const path = 'commands/staff/tester:';
const parseKey = (key: string) => path + key;

export const Tester = {
	Set: {
		InvalidRole: parseKey('SET.INVALID_ROLE'),
		AlreadyHasRole: parseKey('SET.ALREADY_HAS_ROLE'),
		Success: parseKey('SET.SUCCESS')
	}
};
