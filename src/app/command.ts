import { APIApplicationCommandOptionChoice } from 'discord-api-types/v10';
import { ApplicationCommandContext } from './context/application-command-context.js';
import { AutocompleteContext } from './context/autocomplete-context.js';
import { ComponentContext } from './context/component-context.js';

export interface CommandHandler<T extends ApplicationCommandContext> {
  ephemeral: boolean;
  handle(context: T): Promise<void>;
  handleComponent?(context: ComponentContext): Promise<void>;
  handleAutocomplete?(context: AutocompleteContext): Promise<APIApplicationCommandOptionChoice[]>;
}
