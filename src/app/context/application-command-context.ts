import {
  APIApplicationCommandInteraction,
  APIButtonComponentWithURL,
  APIMessageActionRowComponent
} from 'discord-api-types/v10';
import { v4 as uuidv4 } from 'uuid';
import { App } from '../app';
import { InteractionContext } from './interaction-context';

export class ApplicationCommandContext extends InteractionContext {
  command: string;

  constructor(app: App, interaction: APIApplicationCommandInteraction) {
    super(app, interaction);
    this.command = interaction.data.name;
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
