import { APIUserApplicationCommandInteraction } from 'discord-api-types/v10';
import { App } from '../app.js';
import { InteractionContext } from './interaction-context.js';

export class UserCommandContext extends InteractionContext {
  constructor(app: App, interaction: APIUserApplicationCommandInteraction) {
    super(app, interaction);
  }
}
