import { APIApplicationCommandOptionChoice, APIInteractionResponse } from 'discord-api-types/payloads/v10';
import { ApplicationCommandAutocompleteContext } from '../application-command-autocomplete.context';
import { ChatInputApplicationCommandContext } from '../chat-input-application-command.context';
import { about } from './about';
import { find } from './find';

export interface ApplicationChatInputCommandHandler {
  handle: (context: ChatInputApplicationCommandContext) => Promise<APIInteractionResponse>;
  handleAutocomplete?: (context: ApplicationCommandAutocompleteContext) => Promise<APIApplicationCommandOptionChoice[]>;
}

export interface ApplicationChatInputCommandMap {
  [key: string]: ApplicationChatInputCommandHandler | undefined;
}

export const appChatInputCommandMap: ApplicationChatInputCommandMap = {
  about,
  find
};
