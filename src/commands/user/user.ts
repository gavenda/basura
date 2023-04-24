import { CommandHandler } from '@app/command.js';
import { ComponentContext } from '@app/context/component-context.js';
import { UserCommandContext } from '@app/context/user-command-context.js';
import { handlePaginatorComponents } from '@app/paginator.js';
import { Env } from '@env/env';
import { handleFindUser } from '../user.js';

export class FindUserCommand implements CommandHandler<UserCommandContext> {
  ephemeral: boolean = false;
  async handle(context: UserCommandContext): Promise<void> {
    const userId = context.user.id;
    const factory = context.app.env<Env>().DB_FACTORY;
    const db = factory.connection();
    const result = await db.execute(`SELECT * FROM anilist_user WHERE discord_guild_id = ? AND discord_id = ?`, [context.guildId, userId]);

    if (result.size === 0) {
      await context.edit({
        message: `No linked AniList account found for this user.`,
      });
      return;
    }

    const username = (result.rows[0] as Record<string, any>)['anilist_username'];
    await handleFindUser(username, context);
  }

  async handleComponent(context: ComponentContext): Promise<void> {
    await handlePaginatorComponents(context);
  }
}
