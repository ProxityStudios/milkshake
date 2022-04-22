import 'reflect-metadata';
import '@sapphire/plugin-logger/register';
import '@sapphire/plugin-api/register';
import '@sapphire/plugin-editable-commands/register';
import * as colorette from 'colorette';
import { config } from 'dotenv-cra';
import { join } from 'path';
import { inspect } from 'util';
import { srcDir } from '../util/constants';

config({ path: join(srcDir, '.env') });
inspect.defaultOptions.depth = 1;
colorette.createColors({ useColor: true });
