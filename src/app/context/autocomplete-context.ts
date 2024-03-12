import {
  APIApplicationCommandAutocompleteInteraction,
  APIApplicationCommandInteractionDataIntegerOption,
  APIApplicationCommandInteractionDataNumberOption,
  APIApplicationCommandInteractionDataStringOption,
  ApplicationCommandOptionType
} from 'discord-api-types/v10';
import { App } from '../app';
import { InteractionContext } from './interaction-context';

export type AutocompleteOption =
  | APIApplicationCommandInteractionDataStringOption
  | APIApplicationCommandInteractionDataIntegerOption
  | APIApplicationCommandInteractionDataNumberOption;

export class AutocompleteContext extends InteractionContext {
  options: AutocompleteOption[];
  option: AutocompleteOption;

  parent: string;
  command: string;
  group: string | undefined;

  constructor(app: App, interaction: APIApplicationCommandAutocompleteInteraction) {
    super(app, interaction);

    this.command = interaction.data.name;
    this.parent = this.command;

    const rootOption = interaction.data.options?.[0];

    switch (rootOption?.type) {
      case ApplicationCommandOptionType.SubcommandGroup:
        this.group = rootOption.name;
        this.command = rootOption.options[0].name;
        this.option = rootOption.options[0].options?.[0] as AutocompleteOption;
        break;
      case ApplicationCommandOptionType.Subcommand:
        this.command = rootOption.name;
        this.option = rootOption.options?.[0] as AutocompleteOption;
        break;
      default:
        this.option = interaction.data.options?.[0] as AutocompleteOption;
        break;
    }

    this.options = interaction.data.options as AutocompleteOption[];
  }

  findOption<T>(name: string): T | undefined {
    if (this.option.name === name) {
      return this.option as T;
    }
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
