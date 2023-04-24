import { APIApplicationCommandOptionChoice } from 'discord-api-types/v10';
import { AutocompleteContext } from './context/autocomplete-context.js';
import { ComponentContext } from './context/component-context.js';
import { InteractionContext } from './context/interaction-context.js';
import { MessageCommandContext } from './context/message-command-context.js';

export interface CommandHandler<T extends InteractionContext> {
  ephemeral: boolean;
  handle(context: T): Promise<void>;
  handleComponent?(context: ComponentContext): Promise<void>;
  handleAutocomplete?(context: AutocompleteContext): Promise<APIApplicationCommandOptionChoice[]>;
}

export interface MessageCommandHandler {
  ephmeral: boolean;
  handle(context: MessageCommandContext): Promise<void>;
  handleComponent?(context: ComponentContext): Promise<void>;
}
