import { APIMessageApplicationCommandInteraction } from 'discord-api-types/v10';
import { App } from '../app.js';
import { InteractionContext } from './interaction-context.js';

export class MessageCommandContext extends InteractionContext {
  constructor(app: App, interaction: APIMessageApplicationCommandInteraction) {
    super(app, interaction);
  }
}
