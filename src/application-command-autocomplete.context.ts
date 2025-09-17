import {
  APIApplicationCommandAutocompleteInteraction,
  APIApplicationCommandInteractionDataOption,
  ApplicationCommandOptionType,
  InteractionType
} from 'discord-api-types/payloads/v10';
import { Application } from './application';
import { InteractionContext } from './interaction.context';

export class ApplicationCommandAutocompleteContext extends InteractionContext {
  options: APIApplicationCommandInteractionDataOption<InteractionType.ApplicationCommandAutocomplete>[] = [];

  parent: string;
  command: string;
  group: string | undefined;

  constructor(application: Application, interaction: APIApplicationCommandAutocompleteInteraction) {
    super(application, interaction);

    this.command = interaction.data.name;
    this.parent = this.command;

    if (!interaction.data.options) {
      return;
    }

    const root = interaction.data.options[0];

    switch (root.type) {
      case ApplicationCommandOptionType.SubcommandGroup:
        this.group = root.name;
        this.command = root.options[0].name;

        if (root.options[0].options) {
          this.options = root.options[0].options;
        }

        break;
      case ApplicationCommandOptionType.Subcommand:
        this.command = root.name;

        if (root.options) {
          this.options = root.options;
        }
        break;
      default:
        this.options = interaction.data.options;
        break;
    }
  }

  getOption(name: string) {
    const option = this.options.find((option) => option.name === name);

    if (!option) return undefined;

    if (option.type === ApplicationCommandOptionType.String) {
      return option;
    }
    if (option.type === ApplicationCommandOptionType.Boolean) {
      return option;
    }
    if (option.type === ApplicationCommandOptionType.Number) {
      return option;
    }
    if (option.type === ApplicationCommandOptionType.Integer) {
      return option;
    }
  }

  getString(name: string) {
    const value = this.getOption(name)?.value;
    if (typeof value === 'string') {
      return value;
    }
  }

  getRequiredString(name: string) {
    return this.getString(name)!;
  }

  getBoolean(name: string) {
    const value = this.getOption(name)?.value;
    if (typeof value === 'boolean') {
      return value;
    }
  }

  getRequiredBoolean(name: string) {
    return this.getBoolean(name)!;
  }

  getNumber(name: string) {
    const value = this.getOption(name)?.value;
    if (typeof value === 'number') {
      return value;
    }
  }

  getRequiredNumber(name: string) {
    return this.getNumber(name)!;
  }
}
