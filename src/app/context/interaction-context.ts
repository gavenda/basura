import { APIInteraction } from 'discord-api-types/v10';
import { App } from '../app.js';
import { Webhook } from '../webhook.js';
import { MessageOptions } from './message-options.js';

export abstract class InteractionContext {
  app: App;
  id: string;
  token: string;
  userId?: string;
  guildId?: string;
  messageId?: string;
  handled: boolean = false;
  webhook: Webhook;

  constructor(app: App, interaction: APIInteraction) {
    this.app = app;
    this.id = interaction.id;
    this.token = interaction.token;
    this.userId = interaction.member?.user.id ?? interaction.user?.id;
    this.guildId = interaction.guild_id;
    this.webhook = new Webhook(this.app.rest, this.app.id, this.token);
  }

  get messageKey(): string {
    return `message:${this.messageId}`;
  }

  /**
   * Binds a data to the message. You need to have sent a message before binding.
   * @param data data to be bound when the message is sent
   */
  async bindData(data: any): Promise<void> {
    if (this.messageId) {
      await this.app.messageCache.put(this.messageKey, data);
      return;
    }
    throw new Error(`No message id!`);
  }

  async messageData<T>(): Promise<T | null> {
    if (this.messageId) {
      return this.app.messageCache.get(this.messageKey);
    }
    throw new Error(`No message id!`);
  }

  async reply(options: MessageOptions) {
    if (this.messageId) {
      throw new Error(`Follow up message already sent!`);
    }
    const followUp = await this.webhook.followUp(options.message, options.components);
    this.messageId = followUp.id;
  }

  async edit(options: MessageOptions) {
    if (this.messageId) {
      await this.webhook.edit(options.message, this.messageId, options.components);
    } else {
      await this.reply(options);
    }
  }
}
