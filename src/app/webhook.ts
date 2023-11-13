import { Client } from '@studio-bogus/discord-interaction-client';
import { APIEmbed, APIMessage, MessageFlags, RESTPostAPIInteractionFollowupJSONBody, Routes, Snowflake } from 'discord-api-types/v10';
import { MessageComponent } from 'discord-interactions';

const toFollowUp = (options: { message: string | APIEmbed[]; components: any[]; ephemeral: boolean }): RESTPostAPIInteractionFollowupJSONBody => {
  const body: RESTPostAPIInteractionFollowupJSONBody = {
    components: options.components,
  };

  if (typeof options.message === 'string') {
    body.content = options.message;
  } else {
    body.embeds = options.message;
  }

  if (options.ephemeral) {
    body.flags = MessageFlags.Ephemeral;
  }

  return body;
};

export class Webhook {
  #id: Snowflake;
  #token: string;
  #rest: Client;

  constructor(client: Client, id: Snowflake, token: string, auth: boolean = false) {
    this.#id = id;
    this.#token = token;
    this.#rest = client;
  }

  async followUp(options: { message: string | APIEmbed[]; components?: MessageComponent[]; ephemeral?: boolean; auth?: boolean }): Promise<APIMessage> {
    return this.#rest.post<APIMessage>(Routes.webhook(this.#id, this.#token), {
      auth: options.auth ?? false,
      body: toFollowUp({
        message: options.message,
        components: options.components ?? [],
        ephemeral: options.ephemeral ?? false,
      }),
    });
  }

  async edit(options: {
    message: string | APIEmbed[];
    messageId: string;
    components?: MessageComponent[];
    ephemeral?: boolean;
    auth?: boolean;
  }): Promise<APIMessage> {
    return this.#rest.patch<APIMessage>(Routes.webhookMessage(this.#id, this.#token, options.messageId), {
      auth: options.auth ?? false,
      body: toFollowUp({
        message: options.message,
        components: options.components ?? [],
        ephemeral: options.ephemeral ?? false,
      }),
    });
  }

  async delete(id: Snowflake): Promise<void> {
    await this.#rest.delete(Routes.webhookMessage(this.#id, this.#token, id), { auth: false });
  }
}
