import { CommandHandler } from '@app/command.js';
import { SlashCommandContext } from '@app/context/slash-command-context.js';
import { Env } from '@env/env';
import { Redis } from '@upstash/redis/cloudflare';
import { APIWebhook, Routes } from 'discord-api-types/v10';

export class BindCommand implements CommandHandler<SlashCommandContext> {
  ephemeral: boolean = true;
  async handle(context: SlashCommandContext): Promise<void> {
    const channel = context.getRequiredChannel('channel');

    const redis = new Redis({
      url: context.app.env<Env>().UPSTASH_REDIS_REST_URL,
      token: context.app.env<Env>().UPSTASH_REDIS_REST_TOKEN,
    });

    const key = `notification:anime-airing:webhook:${context.guildId}`;
    // Check if webhook exists
    const exists = await redis.hexists(key, 'token');
    if (exists) {
      await context.edit({
        message: `Notifications is already bound to a channel!`,
      });
      return;
    }
    try {
      // Retrieve bot avatar
      // const user = await context.app.rest.get<APIUser>(Routes.user());
      // const selfAvatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}?size=128`;

      // const response = await fetch(selfAvatarUrl);
      // const arrayBuffer = await response.arrayBuffer();
      // const uint8Array = new Uint8Array(arrayBuffer);
      // const base64 = btoa(String.fromCharCode(...uint8Array));
      // const avatar = `data:image/jpeg;base64,${base64}`;

      // Create webhook
      const webhook = await context.app.rest.post<APIWebhook>(Routes.channelWebhooks(channel.parent_id ?? channel.id), {
        body: {
          name: `Anime Airing Notifications`,
        },
      });

      await redis.hset(key, {
        id: `@${webhook.id}`,
        threadId: channel.parent_id ? channel.id : '',
        token: webhook.token,
      });

      await context.edit({
        message: `Notifications now bound to <#${channel.id}>.`,
      });
    } catch (err) {
      console.error(err);
      await context.edit({
        message: `I need the \`Manage Webhooks\` permission to be able to send notifications.`,
      });
    }
  }
}
