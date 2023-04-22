import { CommandHandler } from '@app/command.js';
import { SlashCommandContext } from '@app/context/slash-command-context.js';
import { Env } from '@env/env';

export class UnlinkCommand implements CommandHandler<SlashCommandContext> {
  ephemeral: boolean = true;

  async handle(context: SlashCommandContext): Promise<void> {
    const factory = context.app.env<Env>().DB_FACTORY;
    const db = factory.connection();

    const userCheckQuery = await db.execute(
      `SELECT * FROM anilist_user WHERE discord_guild_id = ? AND discord_id = ?`,
      [context.guildId, context.userId]
    );

    if (userCheckQuery.size === 0) {
      await context.edit({
        message: `Your account is not linked to this discord server.`,
      });
      return;
    }

    const deleteQuery = await db.execute(`DELETE FROM anilist_user WHERE discord_id = ? AND discord_guild_id = ?`, [
      context.userId,
      context.guildId,
    ]);

    if (deleteQuery.rowsAffected > 0) {
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
