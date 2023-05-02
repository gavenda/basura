import { Env } from '@env/env';
import { CommandHandler } from '@studio-bogus/discord-interaction-app';
import { SlashCommandContext } from '@studio-bogus/discord-interaction-app/context';

export class UnlinkCommand implements CommandHandler<SlashCommandContext> {
  ephemeral: boolean = true;

  async handle(context: SlashCommandContext): Promise<void> {
    if (!context.guildId) {
      await context.edit({
        message: `Must be executed inside a guild!`,
      });
      return;
    }

    const db = context.app.env<Env>().DB;
    const result = await db
      .selectFrom(`anilist_user`)
      .where(`discord_guild_id`, '=', context.guildId)
      .where(`discord_id`, `=`, context.userId)
      .selectAll()
      .executeTakeFirst();

    if (!result) {
      await context.edit({
        message: `Your account is not linked to this discord server.`,
      });
      return;
    }

    const deleteQuery = await db
      .deleteFrom(`anilist_user`)
      .where(`discord_guild_id`, '=', context.guildId)
      .where(`discord_id`, `=`, context.userId)
      .executeTakeFirst();

    if (deleteQuery.numDeletedRows) {
      await context.edit({
        message: `Your have successfully unlinked your account.`,
      });
      return;
    }

    await context.edit({
      message: `There was an error unlinking your account.`,
    });
  }
}
