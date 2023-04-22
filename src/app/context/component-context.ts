import { App } from '@app/app.js';
import { APIMessageComponentInteraction, ComponentType } from 'discord-api-types/v10';
import { MessageComponent } from 'discord-interactions';
import { InteractionContext } from './interaction-context.js';

export class ComponentContext extends InteractionContext {
  componentKey: string;
  command: string;
  uniqueId: string;
  customId: string;
  type: ComponentType;
  components: MessageComponent[];

  constructor(app: App, interaction: APIMessageComponentInteraction) {
    super(app, interaction);

    const parts = interaction.data.custom_id.split(`:`);

    this.componentKey = interaction.data.custom_id;
    this.type = interaction.data.component_type;
    this.messageId = interaction.message.id;
    this.command = parts[0];
    this.customId = parts[1];
    this.uniqueId = parts[2];
    this.components = interaction.message.components as any as MessageComponent[];
  }

  async componentData<T>(): Promise<T | null> {
    return this.app.componentCache.get<T>(this.componentKey);
  }
}
