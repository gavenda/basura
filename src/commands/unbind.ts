import { CommandHandler } from '@app/command.js';
import { SlashCommandContext } from '@app/context/slash-command-context.js';
import { Env } from '@env/env';
import { Redis } from '@upstash/redis/cloudflare';
import { Routes } from 'discord-api-types/v10';

export class UnbindCommand implements CommandHandler<SlashCommandContext> {
  ephemeral: boolean = true;
  async handle(context: SlashCommandContext): Promise<void> {
    const redis = new Redis({
      url: context.app.env<Env>().UPSTASH_REDIS_REST_URL,
      token: context.app.env<Env>().UPSTASH_REDIS_REST_TOKEN,
    });

    const key = `notification:anime-airing:webhook:${context.guildId}`;
    // Check if webhook exists
    const exists = await redis.hexists(key, 'token');

    if (!exists) {
      await context.edit({
        message: `Notifications not bound to any channel!`,
      });
      return;
    }

    const webhookId = await redis.hget<string>(`notification:anime-airing:webhook:${context.guildId}`, 'id');

    await redis.hdel(key, 'token');
    await redis.hdel(key, 'id');

    if (webhookId) {
      await context.app.rest.delete(Routes.webhook(webhookId.substring(0)));
    }

    await context.edit({
      message: `Notifications unbound.`,
    });
  }
}
