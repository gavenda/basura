import { Snowflake } from 'discord-api-types/globals';
import { APIMessage } from 'discord-api-types/payloads/v10';
import { RESTPostAPIInteractionFollowupJSONBody, Routes } from 'discord-api-types/rest/v10';
import { safeFetch } from './utils/safe-fetch';

const DISCORD_API_V10 = `https://discord.com/api/v10`;

export class Webhook {
  token: string;
  env: Env;

  constructor(options: { token: string; env: Env }) {
    this.env = options.env;
    this.token = options.token;
  }

  async followUp(data: RESTPostAPIInteractionFollowupJSONBody): Promise<APIMessage> {
    const body = JSON.stringify(data);

    const result = await safeFetch(DISCORD_API_V10 + Routes.webhook(this.env.DISCORD_APPLICATION_ID, this.token), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Basura/2.0',
        'Authorization': `Bot ${this.env.DISCORD_TOKEN}`
      },
      body
    });

    return await result.json<APIMessage>();
  }

  async edit(messageId: string, data: RESTPostAPIInteractionFollowupJSONBody): Promise<APIMessage> {
    const body = JSON.stringify(data);

    const result = await safeFetch(
      DISCORD_API_V10 + Routes.webhookMessage(this.env.DISCORD_APPLICATION_ID, this.token, messageId),
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Basura/2.0',
          'Authorization': `Bot ${this.env.DISCORD_TOKEN}`
        },
        body
      }
    );

    return await result.json<APIMessage>();
  }

  async delete(id: Snowflake): Promise<void> {
    await safeFetch(DISCORD_API_V10 + Routes.webhookMessage(this.env.DISCORD_APPLICATION_ID, this.token, id), {
      headers: {
        'User-Agent': 'Basura/2.0',
        'Authorization': `Bot ${this.env.DISCORD_TOKEN}`
      },
      method: 'DELETE'
    });
  }
}
