import {
  APIInteraction,
  APIMessageTopLevelComponent,
  MessageFlags,
  RESTPostAPIInteractionFollowupJSONBody
} from 'discord-api-types/v10';
import { Application } from './application';
import { Webhook } from './webhook';

interface MessageOptions {
  content: string;
  components?: APIMessageTopLevelComponent[];
  flags: MessageFlags;
}

export abstract class InteractionContext {
  env: Env;
  executionContext: ExecutionContext;
  id: string;
  guildId: string | undefined;
  token: string;
  webhook: Webhook;
  handled: boolean = false;
  messageId: string | undefined;

  constructor(app: Application, interaction: APIInteraction) {
    this.env = app.env;
    this.executionContext = app.executionContext;
    this.id = interaction.id;
    this.token = interaction.token;
    this.guildId = interaction.guild_id;
    this.webhook = new Webhook({
      token: interaction.token,
      env: app.env
    });
  }

  async reply(body: RESTPostAPIInteractionFollowupJSONBody) {
    if (this.messageId) {
      throw new Error(`Follow up message already sent!`);
    }
    const followUp = await this.webhook.followUp(body);
    this.messageId = followUp.id;
  }

  async edit(body: RESTPostAPIInteractionFollowupJSONBody) {
    if (this.messageId) {
      await this.webhook.edit(this.messageId, body);
    } else {
      await this.reply(body);
    }
  }
}
