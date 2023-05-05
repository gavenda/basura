import { Env, KVWebhook } from '@env/env';
import { CommandHandler } from '@studio-bogus/discord-interaction-app';
import { SlashCommandContext } from '@studio-bogus/discord-interaction-app/context';
import { Routes } from 'discord-api-types/v10';

export class UnbindCommand implements CommandHandler<SlashCommandContext> {
  ephemeral: boolean = true;
  async handle(context: SlashCommandContext): Promise<void> {
    const kv = context.app.env<Env>().NOTIFICATION;

    const key = `notification:anime-airing:webhook:${context.guildId}`;
    // Check if webhook exists
    const webhook = await kv.get<KVWebhook>(key, 'json');

    if (!webhook) {
      await context.edit({
        message: `Notifications not bound to any channel!`,
      });
      return;
    }

    await kv.delete(key);
    await context.app.client.delete(Routes.webhook(webhook.id));

    await context.edit({
      message: `Notifications unbound.`,
    });
  }
}
