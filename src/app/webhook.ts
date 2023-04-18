import { APIEmbed, APIMessage, Routes, Snowflake } from 'discord-api-types/v10';
import { discordApi } from '../util.js';

const toJsonString = (message: string | APIEmbed[]): string => {
  if (typeof message === 'string') {
    return JSON.stringify({
      content: message,
    });
  }

  return JSON.stringify({
    embeds: message,
  });
};

export class Webhook {
  private id: Snowflake;
  private token: string;

  constructor(id: Snowflake, token: string) {
    this.id = id;
    this.token = token;
  }

  async followUp(message: string | APIEmbed[]): Promise<APIMessage> {
    const response = await fetch(discordApi(Routes.webhook(this.id, this.token)), {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      method: 'POST',
      body: toJsonString(message),
    });
    return await response.json<APIMessage>();
  }

  async edit(message: string | APIEmbed[], messageId: string): Promise<APIMessage> {
    const response = await fetch(discordApi(Routes.webhookMessage(this.id, this.token, messageId)), {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      method: 'PATCH',
      body: toJsonString(message),
    });
    return await response.json<APIMessage>();
  }

  async delete(id: Snowflake): Promise<void> {
    await fetch(discordApi(Routes.webhookMessage(this.id, this.token, id)), {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      method: 'delete',
    });
  }
}
