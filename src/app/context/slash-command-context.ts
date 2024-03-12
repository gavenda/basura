import {
  APIApplicationCommandInteractionDataAttachmentOption,
  APIApplicationCommandInteractionDataBasicOption,
  APIApplicationCommandInteractionDataBooleanOption,
  APIApplicationCommandInteractionDataChannelOption,
  APIApplicationCommandInteractionDataMentionableOption,
  APIApplicationCommandInteractionDataNumberOption,
  APIApplicationCommandInteractionDataRoleOption,
  APIApplicationCommandInteractionDataStringOption,
  APIApplicationCommandInteractionDataUserOption,
  APIAttachment,
  APIChatInputApplicationCommandInteraction,
  APIInteractionDataResolved,
  APIInteractionDataResolvedChannel,
  APIInteractionDataResolvedGuildMember,
  APIRole,
  APIUser,
  ApplicationCommandOptionType
} from 'discord-api-types/v10';
import { App } from '../app';
import { ApplicationCommandContext } from './application-command-context';

export class SlashCommandContext extends ApplicationCommandContext {
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

  constructor(app: App, interaction: APIChatInputApplicationCommandInteraction) {
    super(app, interaction);

    if (interaction.data.resolved) {
      Object.assign(this.resolved, interaction.data.resolved);
    }
    this.parent = this.command;

    const rootOption = interaction.data.options?.[0];

    switch (rootOption?.type) {
      case ApplicationCommandOptionType.SubcommandGroup:
        this.group = rootOption.name;
        this.command = rootOption.options[0].name;
        this.parseOptions(rootOption.options[0].options);
        break;
      case ApplicationCommandOptionType.Subcommand:
        this.command = rootOption.name;
        this.parseOptions(rootOption.options);
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

  getString(name: string): string | undefined {
    const option = this.options.get(name) as APIApplicationCommandInteractionDataStringOption | undefined;
    if (option !== undefined) {
      return option.value;
    }
  }

  getRequiredString(name: string): string {
    return this.getStringOption(name).value;
  }

  getStringOption(name: string): APIApplicationCommandInteractionDataStringOption {
    const option = this.options.get(name) as APIApplicationCommandInteractionDataStringOption | undefined;
    if (option === undefined) {
      throw new Error(`String option ${name} does not exist.`);
    }
    return option;
  }

  getInteger(name: string): number | undefined {
    const option = this.options.get(name) as APIApplicationCommandInteractionDataNumberOption | undefined;
    if (option !== undefined) {
      return option.value;
    }
  }

  getRequiredInteger(name: string): number {
    return this.getIntegerOption(name).value;
  }

  getIntegerOption(name: string): APIApplicationCommandInteractionDataNumberOption {
    const option = this.options.get(name) as APIApplicationCommandInteractionDataNumberOption | undefined;
    if (option === undefined) {
      throw new Error(`Integer option ${name} does not exist.`);
    }
    return option;
  }

  getBoolean(name: string): boolean | undefined {
    const option = this.options.get(name) as APIApplicationCommandInteractionDataBooleanOption | undefined;
    if (option !== undefined) {
      return option.value;
    }
  }

  getRequiredBoolean(name: string): boolean {
    return this.getBooleanOption(name).value;
  }

  getBooleanOption(name: string): APIApplicationCommandInteractionDataBooleanOption {
    const option = this.options.get(name) as APIApplicationCommandInteractionDataBooleanOption | undefined;
    if (option === undefined) {
      throw new Error(`Boolean option ${name} does not exist.`);
    }
    return option;
  }

  getUserOption(name: string): APIApplicationCommandInteractionDataUserOption & {
    user: APIUser;
    member?: APIInteractionDataResolvedGuildMember;
  } {
    const option = this.options.get(name) as APIApplicationCommandInteractionDataUserOption | undefined;
    if (option === undefined) {
      throw new Error(`User option ${name} does not exist.`);
    }
    const user = this.resolved.users[option.value];
    if (user === undefined) {
      throw new Error(`Resolved user not found.`);
    }
    const member = this.resolved.members[option.value];

    return { user, member, ...option };
  }

  getRequiredChannel(name: string): APIInteractionDataResolvedChannel {
    const option = this.getChannelOption(name);
    const channel = this.resolved.channels[option.value];
    if (channel === undefined) {
      throw new Error(`Required channel option ${name} does not exist.`);
    }
    return channel;
  }

  getChannel(name: string): APIInteractionDataResolvedChannel | undefined {
    const option = this.getChannelOption(name);
    return this.resolved.channels[option.value];
  }

  getChannelOption(name: string): APIApplicationCommandInteractionDataChannelOption {
    const option = this.options.get(name) as APIApplicationCommandInteractionDataChannelOption | undefined;
    if (option == undefined) {
      throw new Error(`Channel option ${name} does not exist.`);
    }
    return option;
  }

  getRoleOption(name: string): APIApplicationCommandInteractionDataRoleOption & { role: APIRole } {
    const option = this.options.get(name) as APIApplicationCommandInteractionDataRoleOption | undefined;
    if (option === undefined) {
      throw new Error(`Role option ${name} does not exist.`);
    }
    const role = this.resolved.roles[option.value];
    if (role === undefined) {
      throw new Error(`Resolved role not found.`);
    }
    return { role, ...option };
  }

  getMentionableOption(
    name: string
  ): APIApplicationCommandInteractionDataMentionableOption & { user?: APIUser; role?: APIRole } {
    const option = this.options.get(name) as APIApplicationCommandInteractionDataMentionableOption | undefined;
    if (option === undefined) {
      throw new Error(`Mentionable option ${name} does not exist.`);
    }
    const user = this.resolved.users[option.value];
    const role = this.resolved.roles[option.value];

    return { user, role, ...option };
  }

  getNumber(name: string): number | undefined {
    const option = this.options.get(name) as APIApplicationCommandInteractionDataNumberOption | undefined;
    if (option !== undefined) {
      return option.value;
    }
  }

  getRequiredNumber(name: string): number {
    return this.getNumberOption(name).value;
  }

  getNumberOption(name: string): APIApplicationCommandInteractionDataNumberOption {
    const option = this.options.get(name) as APIApplicationCommandInteractionDataNumberOption | undefined;
    if (option === undefined) {
      throw new Error(`Number option ${name} does not exist.`);
    }
    return { ...option };
  }

  getAttachmentOption(
    name: string
  ): APIApplicationCommandInteractionDataAttachmentOption & { attachment: APIAttachment } {
    const option = this.options.get(name) as APIApplicationCommandInteractionDataAttachmentOption | undefined;
    if (option === undefined) {
      throw new Error(`Attachment option ${name} does not exist.`);
    }
    const attachment = this.resolved.attachments[option.value];
    if (attachment === undefined) {
      throw new Error(`Resolved attachment not found.`);
    }
    return { attachment, ...option };
  }
}
