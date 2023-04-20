import { Env } from '../env.js';
import { CommandHandler } from '@app/command.js';
import { SlashCommandContext } from '@app/context/slash-command-context.js';
import { findUserByName, findUserName } from '@anilist/user.js';
import { AutocompleteContext } from '@app/context/autocomplete-context.js';
import { APIApplicationCommandOptionChoice } from 'discord-api-types/v10';

export class LinkCommand implements CommandHandler<SlashCommandContext> {
  ephemeral: boolean = true;

  async handle(ctx: SlashCommandContext): Promise<void> {
    const factory = ctx.app.env<Env>().DB_FACTORY;
    const db = factory.connection();

    const userCheckQuery = await db.execute(
      `SELECT * FROM anilist_user WHERE discord_guild_id = ? AND discord_id = ?`,
      [ctx.guildId, ctx.userId]
    );

    if (userCheckQuery.size > 0) {
      await ctx.edit(`Your account is already linked.`);
      return;
    }

    const username = ctx.getStringOption('username').value;
    const user = await findUserByName(username);

    if (!user) {
      await ctx.edit(`Cannot find AniList user \`${username}\`.`);
      return;
    }

    const insertQuery = await db.execute(
      `INSERT INTO anilist_user (discord_id, discord_guild_id, anilist_id, anilist_username) VALUES (?, ?, ?, ?)`,
      [ctx.userId, ctx.guildId, user.id, user.name]
    );

    if (insertQuery.rowsAffected > 0) {
      await ctx.edit(`You have successfully linked your account.`);
      return;
    }

    await ctx.edit(`There was an error linking your account.`);
  }

  async handleAutocomplete(ctx: AutocompleteContext): Promise<APIApplicationCommandOptionChoice[]> {
    const username = ctx.getStringOption(`username`).value;
    const names = await findUserName(username);

    return names.map((x) => {
      return {
        name: x,
        value: x,
      };
    });
  }
}
