import { APIInteraction } from 'discord-api-types/v10';
import { App } from '../app';
import { Webhook } from '../webhook';
import { MessageOptions } from './message-options';

export abstract class InteractionContext {
  app: App;
  id: string;
  token: string;
  /**
   * The id of the invoking user.
   */
  userId: string;
  /**
   * The id of the guild where the command is invoked.
   */
  guildId?: string;
  /**
   * Message id of the interaction when sent.
   */
  messageId?: string;
  handled: boolean = false;
  webhook: Webhook;

  constructor(app: App, interaction: APIInteraction) {
    this.app = app;
    this.id = interaction.id;
    this.token = interaction.token;

    if (interaction.member?.user.id) {
      this.userId = interaction.member.user.id;
    } else if (interaction.user?.id) {
      this.userId = interaction.user.id;
    } else {
      throw new Error(`Cannot determine executing user for the interaction!`);
    }

    this.guildId = interaction.guild_id;

    this.webhook = new Webhook(this.app.client, this.app.id, this.token);
  }

  get messageKey(): string {
    return `message:${this.messageId}`;
  }

  /**
   * Binds a data to the message. You need to have sent a message before binding.
   * @param data data to be bound when the message is sent
   */
  async bindData(data: unknown): Promise<void> {
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
    const followUp = await this.webhook.followUp(options);
    this.messageId = followUp.id;
  }

  async edit(options: MessageOptions) {
    if (this.messageId) {
      await this.webhook.edit({
        ...options,
        messageId: this.messageId
      });
    } else {
      await this.reply(options);
    }
  }
}
