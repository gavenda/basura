import { APIApplicationCommandOptionChoice, MessageFlags } from 'discord-api-types/payloads/v10';
import { MediaType } from '../anilist/gql';
import { findMediaById, findMediaTitles } from '../anilist/media';
import { ApplicationCommandAutocompleteContext } from '../application-command-autocomplete.context';
import { mediaToComponents } from '../utils/anilist';
import { ApplicationChatInputCommandHandler } from './command';

const find = (mediaType: MediaType): ApplicationChatInputCommandHandler => {
  return {
    async handle(context) {
      const mediaId = context.getRequiredNumber('media-id');
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
  const search = context.getRequiredString(`media-id`);
  return findMediaTitles({
    search,
    mediaType,
    env: context.env
  });
};

export const anime = find(MediaType.ANIME);
export const manga = find(MediaType.MANGA);
