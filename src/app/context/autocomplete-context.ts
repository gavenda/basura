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
  options: AutocompleteOption[];
  option: AutocompleteOption;

  constructor(app: App, interaction: APIApplicationCommandAutocompleteInteraction) {
    super(app, interaction);
    this.option = interaction.data.options[0] as AutocompleteOption;
    this.options = interaction.data.options as AutocompleteOption[];
  }

  findOption<T>(name: string): T | undefined {
    return this.options.find((x) => x.name === name) as T;
  }

  getString(name: string): string | undefined {
    const option = this.findOption<APIApplicationCommandInteractionDataStringOption>(name);
    if (option !== undefined) {
      return option.value;
    }
  }

  getRequiredString(name: string): string {
    return this.getStringOption(name).value;
  }

  getStringOption(name: string): APIApplicationCommandInteractionDataStringOption {
    const option = this.findOption<APIApplicationCommandInteractionDataStringOption>(name);
    if (option === undefined) {
      throw new Error(`String option ${name} does not exist.`);
    }
    return option;
  }

  getInteger(name: string): number | undefined {
    const option = this.findOption<APIApplicationCommandInteractionDataIntegerOption>(name);
    if (option !== undefined) {
      return option.value;
    }
  }

  getRequiredInteger(name: string): number {
    return this.getIntegerOption(name).value;
  }

  getIntegerOption(name: string): APIApplicationCommandInteractionDataIntegerOption {
    const option = this.findOption<APIApplicationCommandInteractionDataIntegerOption>(name);
    if (option === undefined) {
      throw new Error(`Integer option ${name} does not exist.`);
    }
    return option;
  }

  getNumber(name: string): number | undefined {
    const option = this.findOption<APIApplicationCommandInteractionDataNumberOption>(name);
    if (option !== undefined) {
      return option.value;
    }
  }

  getRequiredNumber(name: string): number {
    return this.getNumberOption(name).value;
  }

  getNumberOption(name: string): APIApplicationCommandInteractionDataNumberOption {
    const option = this.findOption<APIApplicationCommandInteractionDataNumberOption>(name);
    if (option === undefined) {
      throw new Error(`Number option ${name} does not exist.`);
    }
    return option;
  }
}
