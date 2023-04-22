import { findUserByName, findUserName } from '@anilist/user.js';
import { CommandHandler } from '@app/command.js';
import { AutocompleteContext } from '@app/context/autocomplete-context.js';
import { SlashCommandContext } from '@app/context/slash-command-context.js';
import { APIApplicationCommandOptionChoice } from 'discord-api-types/v10';
import { Env } from '../env.js';

export class LinkCommand implements CommandHandler<SlashCommandContext> {
  ephemeral: boolean = true;

  async handle(context: SlashCommandContext): Promise<void> {
    const factory = context.app.env<Env>().DB_FACTORY;
    const db = factory.connection();

    const userCheckQuery = await db.execute(
      `SELECT * FROM anilist_user WHERE discord_guild_id = ? AND discord_id = ?`,
      [context.guildId, context.userId]
    );

    if (userCheckQuery.size > 0) {
      await context.edit({
        message: `Your account is already linked.`,
      });
      return;
    }

    const username = context.getStringOption('username').value;
    const user = await findUserByName(username);

    if (!user) {
      await context.edit({
        message: `Cannot find AniList user \`${username}\`.`,
      });
      return;
    }

    const insertQuery = await db.execute(
      `INSERT INTO anilist_user (discord_id, discord_guild_id, anilist_id, anilist_username) VALUES (?, ?, ?, ?)`,
      [context.userId, context.guildId, user.id, user.name]
    );

    if (insertQuery.rowsAffected > 0) {
      await context.edit({
        message: `You have successfully linked your account.`,
      });
      return;
    }

    await context.edit({
      message: `There was an error linking your account.`,
    });
  }

  async handleAutocomplete(context: AutocompleteContext): Promise<APIApplicationCommandOptionChoice[]> {
    const username = context.getStringOption(`username`).value;
    const names = await findUserName(username);

    return names.map((x) => {
      return {
        name: x,
        value: x,
      };
    });
  }
}
