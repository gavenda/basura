import { APIInteraction } from 'discord-api-types/payloads/v10';
import { Application } from './application';

export abstract class InteractionContext {
  app: Application;
  id: string;
  token: string;

  constructor(app: Application, interaction: APIInteraction) {
    this.app = app;
    this.id = interaction.id;
    this.token = interaction.token;
  }
}
