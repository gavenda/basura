import { APIApplicationCommandInteraction } from 'discord-api-types/v10';
import { Application } from './application';
import { InteractionContext } from './interaction.context';

export class ApplicationCommandContext extends InteractionContext {
  command: string;

  constructor(application: Application, interaction: APIApplicationCommandInteraction) {
    super(application, interaction);
    this.command = interaction.data.name;
  }
}
