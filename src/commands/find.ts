import {
  APIApplicationCommandOptionChoice,
  ButtonStyle,
  ComponentType,
  InteractionResponseType,
  MessageFlags
} from 'discord-api-types/payloads/v10';
import { MediaType } from '../anilist/gql';
import { findMedia, findMediaTitles } from '../anilist/media';
import { ApplicationCommandAutocompleteContext } from '../application-command-autocomplete.context';
import { htmlToMarkdown } from '../utils/strings';
import { ApplicationChatInputCommandHandler } from './command';

export const find: ApplicationChatInputCommandHandler = {
  async handle(context) {
    const query = context.getRequiredString('query');

    const medias = await findMedia(query, MediaType.ANIME, false);

    if (medias === undefined || medias.length === 0) {
      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `No matching anime/manga media found.`
        }
      };
    }

    const media = medias[0];

    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        components: [
          {
            type: ComponentType.Container,
            components: [
              {
                type: ComponentType.Section,
                components: [
                  {
                    type: ComponentType.TextDisplay,
                    content: `### ${media.title?.english}`
                  }
                ],
                accessory: {
                  type: ComponentType.Button,
                  style: ButtonStyle.Link,
                  label: 'AniList',
                  url: `${media.siteUrl}`
                }
              },
              {
                type: ComponentType.Separator
              },
              {
                type: ComponentType.Section,
                components: [
                  {
                    type: ComponentType.TextDisplay,
                    content: `${htmlToMarkdown(media.description)}`
                  }
                ],
                accessory: {
                  type: ComponentType.Thumbnail,
                  media: {
                    url: `${media.coverImage?.extraLarge}`
                  }
                }
              }
            ]
          },

          {
            type: ComponentType.Container,
            components: [
              {
                type: ComponentType.TextDisplay,
                content: `- **Format** - ${media.format}`
              },
              {
                type: ComponentType.TextDisplay,
                content: `- **Episodes** - ${media.episodes}`
              }
            ]
          }
        ],
        flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2
      }
    };
  },
  async handleAutocomplete(context) {
    return handleMediaTitleAutocomplete(context);
  }
};

export const handleMediaTitleAutocomplete = async (
  context: ApplicationCommandAutocompleteContext,
  type?: MediaType
): Promise<APIApplicationCommandOptionChoice[]> => {
  const query = context.getRequiredString(`query`);
  const titles = await findMediaTitles(query, type, false);

  return titles
    .filter((value, index, array) => array.indexOf(value) === index)
    .map((title) => {
      return {
        name: title,
        value: title
      };
    });
};
