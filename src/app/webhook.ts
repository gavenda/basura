import { Client } from '@client/client.js';
import { APIEmbed, APIMessage, RESTPostAPIInteractionFollowupJSONBody, Routes, Snowflake } from 'discord-api-types/v10';

const toFollowUp = (message: string | APIEmbed[]): RESTPostAPIInteractionFollowupJSONBody => {
  if (typeof message === 'string') {
    return {
      content: message,
    };
  }

  return {
    embeds: message,
  };
};

export class Webhook {
  private id: Snowflake;
  private token: string;
  private rest: Client;

  constructor(client: Client, id: Snowflake, token: string) {
    this.id = id;
    this.token = token;
    this.rest = client;
  }

  async followUp(message: string | APIEmbed[]): Promise<APIMessage> {
    return this.rest.post<APIMessage>(Routes.webhook(this.id, this.token), {
      auth: false,
      body: toFollowUp(message),
    });
  }

  async edit(message: string | APIEmbed[], messageId: string): Promise<APIMessage> {
    return this.rest.patch<APIMessage>(Routes.webhookMessage(this.id, this.token, messageId), {
      auth: false,
      body: toFollowUp(message),
    });
  }

  async delete(id: Snowflake): Promise<void> {
    await this.rest.delete(Routes.webhookMessage(this.id, this.token, id), { auth: false });
  }
}
