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
	BotInformation = 'bot-info'
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

export interface CommandsByCategory {
	category: Category;
	commands: string[];
}
