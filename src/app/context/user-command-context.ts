import { APIUser, APIUserApplicationCommandInteraction } from 'discord-api-types/v10';
import { App } from '../app.js';
import { ApplicationCommandContext } from './application-command-context.js';

export class UserCommandContext extends ApplicationCommandContext {
  user: APIUser;
  userId: string;

  constructor(app: App, interaction: APIUserApplicationCommandInteraction) {
    super(app, interaction);
    this.user = interaction.data.resolved.users[interaction.data.target_id];
    this.userId = this.user.id;
  }
}
