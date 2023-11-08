import { Env } from '@env/env';
import { CommandHandler, handlePaginatorComponents } from '@studio-bogus/discord-interaction-app';
import { ComponentContext, UserCommandContext } from '@studio-bogus/discord-interaction-app/context';
import { handleFindUser } from '../user.js';

export class FindUserCommand implements CommandHandler<UserCommandContext> {
  ephemeral: boolean = false;
  async handle(context: UserCommandContext): Promise<void> {
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
        message: `No linked AniList account found for this user.`,
      });
      return;
    }

    await handleFindUser(result.anilist_username, context);
  }

  async handleComponent(context: ComponentContext): Promise<void> {
    await handlePaginatorComponents(context);
  }
}
