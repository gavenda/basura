import { findMedia, findMediaListEntries, findMediaTitles, MemberEntry, mediaToComponents } from '../anilist/media';
import { MediaType } from '../anilist/types';
import { CommandContext } from '../context';
import { UserTable } from '../db/tables';
import { lookupCommand } from './command';

/** List entries for the media from members of this guild who linked their AniList account. */
const findMemberEntries = async (context: CommandContext, mediaId: number): Promise<MemberEntry[]> => {
  if (!context.guildId) return [];

  const { results } = await context.env.D1.prepare(
    'SELECT discord_id, anilist_id FROM anilist_user WHERE discord_guild_id = ?'
  )
    .bind(context.guildId)
    .run<Pick<UserTable, 'discord_id' | 'anilist_id'>>();

  if (results.length === 0) return [];

  const discordIds = new Map(results.map((row) => [row.anilist_id, row.discord_id]));
  const entries = await findMediaListEntries([...discordIds.keys()], mediaId, context.env);

  return entries.map((entry) => ({ ...entry, discordName: `<@${discordIds.get(entry.userId)}>` }));
};

const mediaCommand = (mediaType: MediaType) =>
  lookupCommand({
    notFound: mediaType === MediaType.ANIME ? 'Unable to find anime.' : 'Unable to find manga.',
    find: (id, env) => findMedia(id, mediaType, env),
    render: async (media, context) => mediaToComponents(media, await findMemberEntries(context, media.id)),
    search: (query, env) => findMediaTitles(query, mediaType, env)
  });

export const anime = mediaCommand(MediaType.ANIME);
export const manga = mediaCommand(MediaType.MANGA);
