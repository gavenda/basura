import { App } from '@app/app.js';
import {
	APIApplicationCommandAutocompleteInteraction,
	APIApplicationCommandInteractionDataIntegerOption,
	APIApplicationCommandInteractionDataNumberOption,
	APIApplicationCommandInteractionDataStringOption
} from 'discord-api-types/v10';

export type AutocompleteOption =
  | APIApplicationCommandInteractionDataStringOption
  | APIApplicationCommandInteractionDataIntegerOption
  | APIApplicationCommandInteractionDataNumberOption;

export class AutocompleteContext {
  app: App;
  id: string;
  token: string;
  userId?: string;
  guildId?: string;
  messageId?: string;
  option: AutocompleteOption;

  constructor(app: App, interaction: APIApplicationCommandAutocompleteInteraction) {
    this.app = app;
    this.id = interaction.id;
    this.token = interaction.token;
    this.userId = interaction.member?.user.id ?? interaction.user?.id;
    this.guildId = interaction.guild_id;
    this.option = interaction.data.options[0] as AutocompleteOption;
  }

  getStringOption(name: string): APIApplicationCommandInteractionDataStringOption {
    const option = this.option as APIApplicationCommandInteractionDataStringOption | undefined;
    if (option === undefined) {
      throw new Error(`String option ${name} does not exist.`);
    }
    return option;
  }

  getIntegerOption(name: string): APIApplicationCommandInteractionDataNumberOption {
    const option = this.option as APIApplicationCommandInteractionDataNumberOption | undefined;
    if (option === undefined) {
      throw new Error(`Integer option ${name} does not exist.`);
    }
    return option;
  }

  getNumberOption(name: string): APIApplicationCommandInteractionDataNumberOption {
    const option = this.option as APIApplicationCommandInteractionDataNumberOption | undefined;
    if (option === undefined) {
      throw new Error(`Number option ${name} does not exist.`);
    }
    return option;
  }
}
