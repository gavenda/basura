import { APIApplicationCommandOptionChoice } from 'discord-api-types/v10';
import { ApplicationCommandContext } from './context/application-command-context';
import { AutocompleteContext } from './context/autocomplete-context';
import { ComponentContext } from './context/component-context';

export interface CommandHandler<T extends ApplicationCommandContext> {
  ephemeral: boolean;
  handle(context: T): Promise<void>;
  handleComponent?(context: ComponentContext): Promise<void>;
  handleAutocomplete?(context: AutocompleteContext): Promise<APIApplicationCommandOptionChoice[]>;
}
