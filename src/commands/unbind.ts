import { CommandHandler } from '@app/command.js';
import { SlashCommandContext } from '@app/context/slash-command-context.js';
import { Env, KVWebhook } from '@env/env';
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
    await context.app.rest.delete(Routes.webhook(webhook.id));

    await context.edit({
      message: `Notifications unbound.`,
    });
  }
}
