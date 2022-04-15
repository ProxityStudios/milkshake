// TODO: configure in json file

export enum Core {
	Ping = 'ping',
	Help = 'help',
	Info = 'info'
}

export enum Owner {
	Eval = 'eval',
	Shutdown = 'shutdown'
}

export enum Staff {
	BotInformation = 'bot-info',
	Tester = 'tester'
}

export enum Admin {
	Language = 'language',
	Prefix = 'prefix'
}

export enum Mod {
	Ban = 'ban',
	Kick = 'kick'
}

export enum Category {
	Admin = 'Administrator',
	Mod = 'Moderator',
	Core = 'Core',
	Staff = 'Staff',
	Owner = 'Owner'
}

export interface WithCategory {
	category: Category;
	commands: string[];
}

export type All = Owner | Core | Staff | Mod | Admin;
