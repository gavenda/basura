import {
  APIApplicationCommandInteractionDataBasicOption,
  APIChatInputApplicationCommandInteraction,
  APIInteractionDataResolved,
  ApplicationCommandOptionType
} from 'discord-api-types/payloads/v10';
import { Application } from './application';
import { ApplicationCommandContext } from './application-command.context';

export class ChatInputApplicationCommandContext extends ApplicationCommandContext {
  private options = new Map<string, APIApplicationCommandInteractionDataBasicOption>();

  resolved: Required<APIInteractionDataResolved> = {
    users: {},
    members: {},
    roles: {},
    channels: {},
    attachments: {}
  };

  parent: string;
  group: string | undefined;

  constructor(application: Application, interaction: APIChatInputApplicationCommandInteraction) {
    super(application, interaction);

    if (interaction.data.resolved) {
      Object.assign(this.resolved, interaction.data.resolved);
    }

    this.parent = this.command;

    if (!interaction.data.options) {
      return;
    }

    const root = interaction.data.options[0];

    switch (root.type) {
      case ApplicationCommandOptionType.SubcommandGroup:
        this.group = root.name;
        this.command = root.options[0].name;
        this.parseOptions(root.options[0].options);
        break;
      case ApplicationCommandOptionType.Subcommand:
        this.command = root.name;
        this.parseOptions(root.options);
        break;
      default:
        this.parseOptions(interaction.data.options as APIApplicationCommandInteractionDataBasicOption[]);
        break;
    }
  }

  private parseOptions(options: APIApplicationCommandInteractionDataBasicOption[] = []): void {
    for (const option of options) {
      this.options.set(option.name, option);
    }
  }

  getOption(name: string) {
    return this.options.get(name);
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
