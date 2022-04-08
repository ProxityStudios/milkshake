import { Config } from '../config';

if (Config.dev) {
	process.env.NODE_ENV = 'development';
} else {
	process.env.NODE_ENV = 'production';
}

import 'reflect-metadata';
import '@sapphire/plugin-logger/register';
// import '@sapphire/plugin-api/register';
import '@sapphire/plugin-editable-commands/register';
import '@sapphire/plugin-i18next/register';

import * as colorette from 'colorette';
import { join } from 'path';
import { inspect } from 'util';
import { Constants } from '.';
import { config } from 'dotenv-cra';

const env = Config.dev ? '.env.development' : '.env';

config({ path: join(Constants.rootDir, env) });
inspect.defaultOptions.depth = 1;
colorette.createColors({ useColor: true });
