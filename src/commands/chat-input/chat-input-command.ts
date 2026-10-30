import type {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  RESTPostAPIChatInputApplicationCommandsJSONBody
} from 'discord.js';
import type { AppContext } from '../../context';

export interface AppChatInputCommand {
  name: string;
  data: () => RESTPostAPIChatInputApplicationCommandsJSONBody;
  execute: (context: AppContext, interaction: ChatInputCommandInteraction) => Promise<void>;
  /** Answers within 3 seconds, or Discord drops the response. */
  autocomplete?: (context: AppContext, interaction: AutocompleteInteraction) => Promise<void>;
}
