import { Snowflake } from 'discord-api-types/globals';
import { APIMessage } from 'discord-api-types/payloads/v10';
import { RESTPostAPIInteractionFollowupJSONBody, Routes } from 'discord-api-types/rest/v10';
import { safeFetch } from './utils/safe-fetch';

const DISCORD_API_V10 = `https://discord.com/api/v10`;

export class Webhook {
  id: Snowflake;
  token: string;

  constructor(id: Snowflake, token: string) {
    this.id = id;
    this.token = token;
  }

  async followUp(data: RESTPostAPIInteractionFollowupJSONBody): Promise<APIMessage> {
    const body = JSON.stringify(data);

    const result = await safeFetch(DISCORD_API_V10 + Routes.webhook(this.id, this.token), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    });

    return await result.json<APIMessage>();
  }

  async edit(messageId: string, data: RESTPostAPIInteractionFollowupJSONBody): Promise<APIMessage> {
    const body = JSON.stringify(data);

    const result = await safeFetch(DISCORD_API_V10 + Routes.webhookMessage(this.id, this.token, messageId), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    });

    return await result.json<APIMessage>();
  }

  async delete(id: Snowflake): Promise<void> {
    await safeFetch(DISCORD_API_V10 + Routes.webhookMessage(this.id, this.token, id), {
      method: 'DELETE'
    });
  }
}
