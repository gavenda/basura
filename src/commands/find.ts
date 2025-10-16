import { APIApplicationCommandOptionChoice, MessageFlags } from 'discord-api-types/v10';
import { MediaType } from '../anilist/gql';
import { findMediaById, findMediaTitles, mediaToComponents } from '../anilist/media';
import { ApplicationCommandAutocompleteContext } from '../application-command-autocomplete.context';
import { isBlank } from '../utils/strings';
import { ApplicationChatInputCommandHandler } from './command';

const find = (mediaType: MediaType): ApplicationChatInputCommandHandler => {
  return {
    async handle(context) {
      const mediaId = context.getRequiredNumber('id');
      const media = await findMediaById({ mediaId, env: context.env, mediaType });

      if (!media) {
        await context.reply({
          flags: MessageFlags.Ephemeral,
          content: mediaType == MediaType.ANIME ? 'Unable to find anime.' : 'Unable to find manga.'
        });
        return;
      }

      await context.reply({
        components: mediaToComponents(media),
        flags: MessageFlags.IsComponentsV2
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

export const anime = find(MediaType.ANIME);
export const manga = find(MediaType.MANGA);
