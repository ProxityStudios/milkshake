import { ApplyOptions } from '@sapphire/decorators';
import type { Args, Result, UserError } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';
import { SubCommandPluginCommand } from '@sapphire/plugin-subcommands';
import type { Message, User } from 'discord.js';

import { AppTesterEntity, Keys, Types } from '../../lib';

@ApplyOptions<SubCommandPluginCommand.Options>({
	name: Types.Commands.Staff.Tester,
	fullCategory: [Types.Commands.Category.Staff],
	preconditions: [[Types.Preconditions.Owner.OwnerOnly, Types.Preconditions.Staff.StaffOnly]],
	subCommands: ['add', 'remove', { input: 'check', default: true }]
})
export class StaffCommand extends SubCommandPluginCommand {
	private appDataManager = this.container.services.get('database').dataSources.app.manager;
	private cache = this.container.services.get('cache');

	async add(message: Message, args: Args) {
		const loadingMsg = await this.container.utils.sendLoadingMessage(message);

		let user: User | Result<User, UserError> = await args.pickResult('user');
		let role: Types.Tester.Role | Result<string, UserError> = await args.pickResult('string');

		if (user.error || role.error) {
			return loadingMsg.edit(
				await resolveKey(message, Keys.Common.MissingArguments, {
					arguments: `<user> <tester-role>`
				})
			);
		} else if (!this.isValidRole(role.value)) {
			return loadingMsg.edit(await resolveKey(message, Keys.Tester.Set.InvalidRole));
		} else {
			user = user.value;
			role = role.value as Types.Tester.Role;
		}

		let savedTester = await this.appDataManager.findOneBy(AppTesterEntity, {
			id: user.id
		});

		if (!savedTester) {
			const newTester = this.appDataManager.create(AppTesterEntity, {
				id: user.id,
				name: user.username,
				discriminator: user.discriminator,
				roles: [role]
			});

			savedTester = await this.appDataManager.save(newTester);
			this.cache.cacheTester(savedTester);
		} else {
			if (savedTester.roles.includes(role)) {
				return loadingMsg.edit(await resolveKey(message, Keys.Tester.Set.AlreadyHasRole));
			}

			savedTester.roles.push(role);
			savedTester = await this.appDataManager.save(savedTester);
			this.cache.cacheTester(savedTester);
		}

		return loadingMsg.edit(
			await resolveKey(message, Keys.Tester.Set.Success, {
				testerTag: user.tag,
				testerRoles: savedTester.roles.join(', ')
			})
		);
	}

	// remove(message: Message, args: Args) {}

	// check(message: Message, args: Args) {}

	isValidRole(value: string): boolean {
		const roles = this.container.utils.convertEnumToArray<string>(Types.Tester.Role);
		return roles.includes(value);
	}
}
