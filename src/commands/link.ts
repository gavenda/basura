import { findUserByName, findUserName } from '@anilist/user.js';
import { CommandHandler } from '@app/command.js';
import { AutocompleteContext } from '@app/context/autocomplete-context.js';
import { SlashCommandContext } from '@app/context/slash-command-context.js';
import { APIApplicationCommandOptionChoice } from 'discord-api-types/v10';
import { Env } from '../env.js';

export class LinkCommand implements CommandHandler<SlashCommandContext> {
  ephemeral: boolean = true;

  async handle(context: SlashCommandContext): Promise<void> {
    const db = context.app.env<Env>().DB;
    if (!context.guildId) {
      await context.edit({
        message: `Must be executed inside a guild!`,
      });
      return;
    }

    const result = await db
      .selectFrom(`anilist_user`)
      .where(`discord_guild_id`, '=', context.guildId)
      .where(`discord_id`, `=`, context.userId)
      .selectAll()
      .executeTakeFirst();

    if (result) {
      await context.edit({
        message: `Your account is already linked.`,
      });
      return;
    }

    const username = context.getRequiredString(`username`);
    const user = await findUserByName(username);

    if (!user) {
      await context.edit({
        message: `Cannot find AniList user \`${username}\`.`,
      });
      return;
    }

    const insert = await db
      .insertInto(`anilist_user`)
      .values({
        discord_id: context.userId,
        discord_guild_id: context.guildId,
        anilist_id: user.id,
        anilist_username: user.name,
      })
      .executeTakeFirst();

    if (insert.insertId) {
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
    const username = context.getRequiredString(`username`);
    const names = await findUserName(username);

    return names.map((x) => {
      return {
        name: x,
        value: x,
      };
    });
  }
}
