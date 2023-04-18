import { Env } from 'src/env.js';
import { CommandHandler } from '../command.js';
import { InteractionContext } from '../interaction-context.js';

export class Unlink implements CommandHandler {
  async handle(ctx: InteractionContext): Promise<void> {
    const factory = ctx.app.env<Env>().DB_FACTORY;
    const db = factory.connection();

    const userCheckQuery = await db.execute(
      `SELECT * FROM anilist_user WHERE discord_guild_id = ? AND discord_id = ?`,
      [ctx.guildId, ctx.userId]
    );

    if (userCheckQuery.size === 0) {
      await ctx.edit(`Your account is not linked to this discord server.`);
      return;
    }

    const deleteQuery = await db.execute(`DELETE FROM anilist_user WHERE discord_id = ? AND discord_guild_id = ?`, [
      ctx.userId,
      ctx.guildId,
    ]);

		if (deleteQuery.rowsAffected > 0) {
			await ctx.edit(`Your have successfully unlinked your account.`);
			return;
		}

		await ctx.edit(`There was an error unlinking your account.`);
  }
}
