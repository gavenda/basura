import { APIApplicationCommandOptionChoice, MessageFlags } from 'discord-api-types/v10';
import { MediaList, MediaType } from '../anilist/gql';
import { findMediaById, findMediaListByUserIdsAndMediaId, findMediaTitles, mediaToComponents } from '../anilist/media';
import { ApplicationCommandAutocompleteContext } from '../application-command-autocomplete.context';
import { UserTable } from '../db/tables';
import { isBlank } from '../utils/strings';
import { ApplicationChatInputCommandHandler } from './command';

const find = (mediaType: MediaType): ApplicationChatInputCommandHandler => {
  return {
    async handle(context) {
      const mediaId = context.getRequiredNumber('id');
      const media = await findMediaById({ mediaId, env: context.env, mediaType });
      let mediaList: MediaList[] = [];
      let nameMap: Record<number, string> = {};

      if (!media) {
        await context.reply({
          flags: MessageFlags.Ephemeral,
          content: mediaType == MediaType.ANIME ? 'Unable to find anime.' : 'Unable to find manga.'
        });
        return;
      }

      if (context.guildId) {
        const fetchedMediaList = await fetchDbMediaList({ mediaId, env: context.env, guildId: context.guildId });

        if (!fetchedMediaList) {
          mediaList = [];
        } else {
          mediaList = fetchedMediaList;
          nameMap = await mapNameToDiscordName(
            context.env,
            fetchedMediaList.map((x) => x.userId)
          );
        }
      }

      await context.reply({
        components: await mediaToComponents({
          media,
          mediaList,
          nameMap
        }),
        flags: MessageFlags.IsComponentsV2 | MessageFlags.SuppressNotifications
      });
    },
    async handleAutocomplete(context) {
      return handleMediaTitleAutocomplete(context, mediaType);
    }
  };
};

export const handleMediaTitleAutocomplete = async (
  context: ApplicationCommandAutocompleteContext,
  mediaType?: MediaType
): Promise<APIApplicationCommandOptionChoice[]> => {
  const search = context.getRequiredString(`id`);

  if (isBlank(search)) {
    return [];
  }

  return findMediaTitles({
    search,
    mediaType,
    env: context.env
  });
};

const fetchDbMediaList = async (options: {
  mediaId: number;
  env: Env;
  guildId: string;
}): Promise<MediaList[] | undefined> => {
  const { mediaId, env, guildId } = options;

  const stmt = env.D1.prepare(`SELECT * FROM anilist_user WHERE discord_guild_id = ?`);
  const result = await stmt.bind(guildId).run();
  const data = result.results as unknown as UserTable[];
  const userIds = data.map((x) => x.anilist_id);
  return findMediaListByUserIdsAndMediaId({
    userIds,
    mediaId,
    env
  });
};

const mapNameToDiscordName = async (env: Env, userIds: number[]): Promise<Record<number, string>> => {
  if (userIds.length === 0) {
    return {};
  }

  const stmt = env.D1.prepare(`SELECT * FROM anilist_user WHERE anilist_id in (${userIds.join(',')})`);
  const result = await stmt.run();
  const data = result.results as unknown as UserTable[];

  const nameMap: Record<number, string> = {};

  for (const row of data) {
    nameMap[row.anilist_id] = `<@${row.discord_id}>`;
  }

  return nameMap;
};

export const anime = find(MediaType.ANIME);
export const manga = find(MediaType.MANGA);
