import { Snowflake } from 'discord-api-types/globals';
import { APIMessage } from 'discord-api-types/payloads/v10';
import { RESTPostAPIInteractionFollowupJSONBody, RouteBases, Routes } from 'discord-api-types/rest/v10';
import { kvRateLimitedFetch } from './utils/kv-fetch';

export class Webhook {
  token: string;
  env: Env;

  constructor(options: { token: string; env: Env }) {
    this.env = options.env;
    this.token = options.token;
  }

  async followUp(data: RESTPostAPIInteractionFollowupJSONBody): Promise<APIMessage> {
    const body = JSON.stringify(data);

    const result = await kvRateLimitedFetch(
      RouteBases.api + Routes.webhook(this.env.DISCORD_APPLICATION_ID, this.token),
      this.env,
      {
        method: 'POST',
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

  async edit(messageId: string, data: RESTPostAPIInteractionFollowupJSONBody): Promise<APIMessage> {
    const body = JSON.stringify(data);

    const result = await kvRateLimitedFetch(
      RouteBases.api + Routes.webhookMessage(this.env.DISCORD_APPLICATION_ID, this.token, messageId),
      this.env,
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
    await kvRateLimitedFetch(
      RouteBases.api + Routes.webhookMessage(this.env.DISCORD_APPLICATION_ID, this.token, id),
      this.env,
      {
        headers: {
          'User-Agent': 'Basura/2.0',
          'Authorization': `Bot ${this.env.DISCORD_TOKEN}`
        },
        method: 'DELETE'
      }
    );
  }
}
