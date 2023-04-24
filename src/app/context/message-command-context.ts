import { APIMessage, APIMessageApplicationCommandInteraction } from 'discord-api-types/v10';
import { MessageComponent, MessageComponentTypes } from 'discord-interactions';
import { v4 as uuidv4 } from 'uuid';
import { App } from '../app.js';
import { InteractionContext } from './interaction-context.js';

export class MessageCommandContext extends InteractionContext {
  message: APIMessage;
  command: string;

  constructor(app: App, interaction: APIMessageApplicationCommandInteraction) {
    super(app, interaction);
    this.command = interaction.data.name;
    this.message = interaction.data.resolved.messages[interaction.data.target_id];
  }

  async createComponent<T extends MessageComponent>(options: { id: string; component: T; data?: any }): Promise<T> {
    if (options.component.type != MessageComponentTypes.ACTION_ROW) {
      const uniqueId = uuidv4();
      options.component.custom_id = `${this.command}:${options.id}:${uniqueId}`;
      if (options.data) {
        // Only put data if its not null, otherwise it would be pointless
        await this.app.componentCache.put(options.component.custom_id, options.data);
      }
      return options.component;
    }
    throw new Error(`Cannot create action row components!`);
  }
}
