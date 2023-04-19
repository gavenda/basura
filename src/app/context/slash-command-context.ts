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
  APIInteractionDataResolvedChannel,
  APIInteractionDataResolvedGuildMember,
  APIRole,
  APIUser,
} from 'discord-api-types/v10';
import { App } from '../app.js';
import { InteractionContext } from './interaction-context.js';

export class SlashCommandContext extends InteractionContext {
  private options = new Map<string, APIApplicationCommandInteractionDataBasicOption>();

  constructor(app: App, interaction: APIChatInputApplicationCommandInteraction) {
    super(app, interaction);
    this.parseOptions(interaction.data.options as APIApplicationCommandInteractionDataBasicOption[]);
  }

  private parseOptions(options: APIApplicationCommandInteractionDataBasicOption[] = []): void {
    for (const option of options) {
      this.options.set(option.name, option);
    }
  }

  getStringOption(name: string): APIApplicationCommandInteractionDataStringOption {
    const option = this.options.get(name) as APIApplicationCommandInteractionDataStringOption | undefined;
    if (option === undefined) {
      throw new Error(`String option ${name} does not exist.`);
    }
    return option;
  }

  getIntegerOption(name: string): APIApplicationCommandInteractionDataNumberOption {
    const option = this.options.get(name) as APIApplicationCommandInteractionDataNumberOption | undefined;
    if (option === undefined) {
      throw new Error(`Integer option ${name} does not exist.`);
    }
    return option;
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

  getChannelOption(
    name: string
  ): APIApplicationCommandInteractionDataChannelOption & { channel: APIInteractionDataResolvedChannel } {
    const option = this.options.get(name) as APIApplicationCommandInteractionDataChannelOption | undefined;
    if (option === undefined) {
      throw new Error(`Channel option ${name} does not exist.`);
    }
    const channel = this.resolved.channels[option.value];
    if (channel === undefined) {
      throw new Error(`Resolved channel not found.`);
    }
    return { channel, ...option };
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
