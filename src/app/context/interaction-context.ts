import { APIApplicationCommandInteraction, APIEmbed, APIInteractionDataResolved } from 'discord-api-types/v10';
import { App } from '../app.js';
import { Webhook } from '../webhook.js';

export abstract class InteractionContext {
  app: App;
  id: string;
  token: string;
  userId?: string;
  guildId?: string;
  messageId?: string;

  resolved: Required<APIInteractionDataResolved> = {
    users: {},
    members: {},
    roles: {},
    channels: {},
    attachments: {},
  };

  private webhook: Webhook;

  constructor(app: App, interaction: APIApplicationCommandInteraction) {
    this.app = app;
    this.id = interaction.id;
    this.token = interaction.token;
    this.userId = interaction.member?.user.id ?? interaction.user?.id;
    this.guildId = interaction.guild_id;
    this.webhook = new Webhook(this.app.id, this.token);

    if (interaction.data.resolved) {
      Object.assign(this.resolved, interaction.data.resolved);
    }
  }

  async reply(message: string | APIEmbed[]) {
    if (this.messageId) {
      throw new Error(`Follow up message already sent!`);
    }
    const followUp = await this.webhook.followUp(message);
    this.messageId = followUp.id;
  }

  async edit(message: string | APIEmbed[]) {
    if (this.messageId) {
      await this.webhook.edit(message, this.messageId);
    } else {
      await this.reply(message);
    }
  }
}
