import { APIApplicationCommandOptionChoice } from 'discord-api-types/v10';
import { AutocompleteContext } from './context/autocomplete-context.js';
import { InteractionContext } from './context/interaction-context.js';

export interface CommandHandler<T extends InteractionContext> {
  ephemeral: boolean;
  handle(ctx: T): Promise<void>;
  handleAutocomplete?(ctx: AutocompleteContext): Promise<APIApplicationCommandOptionChoice[]>;
}
