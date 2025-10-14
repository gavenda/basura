import {
  APIApplicationCommandOptionChoice,
  InteractionResponseType,
  MessageFlags
} from 'discord-api-types/payloads/v10';
import { MediaType } from '../anilist/gql';
import { findMediaById, findMediaTitles } from '../anilist/media';
import { ApplicationCommandAutocompleteContext } from '../application-command-autocomplete.context';
import { mediaDisplay } from '../utils/anilist';
import { ApplicationChatInputCommandHandler } from './command';

const find = (mediaType: MediaType): ApplicationChatInputCommandHandler => {
  return {
    async handle(context) {
      const mediaId = context.getRequiredNumber('media-id');
      const media = await findMediaById(mediaId, mediaType);

      if (!media) {
        return {
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            flags: MessageFlags.Ephemeral,
            content: mediaType == MediaType.ANIME ? 'Unable to find anime.' : 'Unable to find manga.'
          }
        };
      }

      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          components: mediaDisplay(media),
          flags: MessageFlags.IsComponentsV2
        }
      };
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
  const query = context.getRequiredString(`media-id`);
  return findMediaTitles(query, mediaType, false);
};

export const anime = find(MediaType.ANIME);
export const manga = find(MediaType.MANGA);
