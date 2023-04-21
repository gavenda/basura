import { App } from '@app/app.js';
import { APIMessageComponentInteraction, ComponentType } from 'discord-api-types/v10';
import { InteractionContext } from './interaction-context.js';

export class ComponentContext extends InteractionContext {
  key: string;
  command: string;
  uniqueId: string;
  customId: string;
  type: ComponentType;

  constructor(app: App, interaction: APIMessageComponentInteraction) {
    super(app, interaction);

    const parts = interaction.data.custom_id.split(`:`);

    this.key = interaction.data.custom_id;
    this.type = interaction.data.component_type;
    this.messageId = interaction.message.id;
    this.command = parts[0];
    this.customId = parts[1];
    this.uniqueId = parts[2];
  }

  async data<T>(): Promise<T> {
    const data = await this.app.componentManager.getComponentData(this.key);
    return data as T;
  }
}
