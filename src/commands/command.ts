import { APIApplicationCommandOptionChoice, MessageFlags } from 'discord-api-types/v10';
import { ApplicationCommandAutocompleteContext } from '../application-command-autocomplete.context';
import { ChatInputApplicationCommandContext } from '../chat-input-application-command.context';
import { about } from './about';
import { character } from './character';
import { anime, manga } from './find';
import { staff } from './staff';

export interface ApplicationChatInputCommandHandler {
  /**
   * Initial flag to send. Useful if you want the message to be ephemeral and suppress notifs.
   */
  flags?: MessageFlags;
  handle: (context: ChatInputApplicationCommandContext) => Promise<void>;
  handleAutocomplete?: (context: ApplicationCommandAutocompleteContext) => Promise<APIApplicationCommandOptionChoice[]>;
}

export interface ApplicationChatInputCommandMap {
  [key: string]: ApplicationChatInputCommandHandler | undefined;
}

export const appChatInputCommandMap: ApplicationChatInputCommandMap = {
  about,
  anime,
  manga,
  staff,
  character
};
