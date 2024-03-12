import {
  APIActionRowComponent,
  APIButtonComponentWithURL,
  APIMessageActionRowComponent,
  APIMessageComponentInteraction,
  ComponentType
} from 'discord-api-types/v10';
import { v4 as uuidv4 } from 'uuid';
import { App } from '../app';
import { InteractionContext } from './interaction-context';

export class ComponentContext extends InteractionContext {
  componentKey: string;
  command: string;
  uniqueId: string;
  customId: string;
  type: ComponentType;
  components: APIActionRowComponent<APIMessageActionRowComponent>[] = [];

  constructor(app: App, interaction: APIMessageComponentInteraction) {
    super(app, interaction);

    const parts = interaction.data.custom_id.split(`:`);

    this.componentKey = interaction.data.custom_id;
    this.type = interaction.data.component_type;
    this.messageId = interaction.message.id;
    this.command = parts[0];
    this.customId = parts[1];
    this.uniqueId = parts[2];

    if (interaction.message.components) {
      this.components = interaction.message.components;
    }
  }

  async componentData<T>(): Promise<T | null> {
    return this.app.componentCache.get<T>(this.componentKey);
  }

  async createComponent<T extends Exclude<APIMessageActionRowComponent, APIButtonComponentWithURL>>(options: {
    id: string;
    component: T;
    data?: unknown;
  }): Promise<T> {
    const uniqueId = uuidv4();
    options.component.custom_id = `${this.command}:${options.id}:${uniqueId}`;
    if (options.data) {
      // Only put data if its not null, otherwise it would be pointless
      await this.app.componentCache.put(options.component.custom_id, options.data);
    }
    return options.component;
  }
}
