import { APIMessage, APIMessageApplicationCommandInteraction } from 'discord-api-types/v10';
import { App } from '../app.js';
import { ApplicationCommandContext } from './application-command-context.js';

export class MessageCommandContext extends ApplicationCommandContext {
  message: APIMessage;

  constructor(app: App, interaction: APIMessageApplicationCommandInteraction) {
    super(app, interaction);
    this.message = interaction.data.resolved.messages[interaction.data.target_id];
  }
}
