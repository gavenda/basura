import { App } from '@app/app.js';
import {
  APIApplicationCommandAutocompleteInteraction,
  APIApplicationCommandInteractionDataIntegerOption,
  APIApplicationCommandInteractionDataNumberOption,
  APIApplicationCommandInteractionDataStringOption,
} from 'discord-api-types/v10';
import { InteractionContext } from './interaction-context.js';

export type AutocompleteOption =
  | APIApplicationCommandInteractionDataStringOption
  | APIApplicationCommandInteractionDataIntegerOption
  | APIApplicationCommandInteractionDataNumberOption;

export class AutocompleteContext extends InteractionContext {
  option: AutocompleteOption;

  constructor(app: App, interaction: APIApplicationCommandAutocompleteInteraction) {
    super(app, interaction);
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
