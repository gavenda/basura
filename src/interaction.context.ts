import { APIInteraction } from 'discord-api-types/payloads/v10';
import { Application } from './application';

export abstract class InteractionContext {
  application: Application;
  id: string;
  token: string;

  constructor(application: Application, interaction: APIInteraction) {
    this.application = application;
    this.id = interaction.id;
    this.token = interaction.token;
  }
}
