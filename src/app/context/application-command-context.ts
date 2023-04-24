import { MessageCommandContext } from './message-command-context.js';
import { SlashCommandContext } from './slash-command-context.js';

export type ApplicationCommandContext = SlashCommandContext | MessageCommandContext;
