import {
  APIApplicationCommand,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChannelType
} from 'discord-api-types/v10';
import { MediaFormat, MediaSeason } from '../anilist/gql/types';

export const COMMAND_ABOUT: Partial<APIApplicationCommand> = {
  name: 'about',
  type: ApplicationCommandType.ChatInput,
  description: 'Literally all about the trash, me!'
};

export const COMMAND_LINK: Partial<APIApplicationCommand> = {
  name: 'link',
  type: ApplicationCommandType.ChatInput,
  description: 'Link your Discord account to your AniList account.',
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: 'username',
      description: 'Your AniList username.',
      autocomplete: true,
      required: true
    }
  ]
};

export const COMMAND_UNLINK: Partial<APIApplicationCommand> = {
  name: 'unlink',
  type: ApplicationCommandType.ChatInput,
  description: 'Unlink your AniList account from your Discord account.'
};

export const COMMAND_FIND: Partial<APIApplicationCommand> = {
  name: 'find',
  type: ApplicationCommandType.ChatInput,
  description: 'Looks up the name of the anime/manga.',
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: 'query',
      description: 'Name of the anime/manga.',
      autocomplete: true,
      required: true
    }
  ]
};

export const COMMAND_ANIME: Partial<APIApplicationCommand> = {
  name: 'anime',
  type: ApplicationCommandType.ChatInput,
  description: 'Looks up the name of the anime.',
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: 'query',
      description: 'Name of the anime.',
      autocomplete: true,
      required: true
    }
  ]
};

export const COMMAND_MANGA: Partial<APIApplicationCommand> = {
  name: 'manga',
  type: ApplicationCommandType.ChatInput,
  description: 'Looks up the name of the manga.',
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: 'query',
      description: 'Name of the manga.',
      autocomplete: true,
      required: true
    }
  ]
};

export const COMMAND_STAFF: Partial<APIApplicationCommand> = {
  name: 'staff',
  type: ApplicationCommandType.ChatInput,
  description: 'Looks up the name of an anime/manga staff.',
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: 'query',
      description: 'Name of the anime/manga staff.',
      autocomplete: true,
      required: true
    }
  ]
};

export const COMMAND_USER: Partial<APIApplicationCommand> = {
  name: 'user',
  type: ApplicationCommandType.ChatInput,
  description: `Looks up the statistics of a user's AniList.`,
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: 'username',
      description: 'AniList username.',
      autocomplete: true,
      required: true
    }
  ]
};

export const COMMAND_CHARACTER: Partial<APIApplicationCommand> = {
  name: 'character',
  type: ApplicationCommandType.ChatInput,
  description: `Looks up the name of an anime/manga character.`,
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: 'query',
      description: 'Name of the anime/manga character.',
      autocomplete: true,
      required: true
    }
  ]
};

export const COMMAND_RANKING: Partial<APIApplicationCommand> = {
  name: 'ranking',
  type: ApplicationCommandType.ChatInput,
  description: `Shows the current ranking based on given parameters.`,
  options: [
    {
      type: ApplicationCommandOptionType.Integer,
      name: 'amount',
      description: 'Number of media to show. Defaults to 10.',
      required: false
    },
    {
      type: ApplicationCommandOptionType.String,
      name: 'season',
      description: 'The media season.',
      required: false,
      choices: [
        {
          name: 'Fall',
          value: MediaSeason.FALL
        },
        {
          name: 'Spring',
          value: MediaSeason.SPRING
        },
        {
          name: 'Summer',
          value: MediaSeason.SUMMER
        },
        {
          name: 'Winter',
          value: MediaSeason.WINTER
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.Integer,
      name: 'year',
      description: 'The media year.',
      required: false
    },
    {
      type: ApplicationCommandOptionType.String,
      name: 'format',
      description: 'The media format. Defaults to TV.',
      required: false,
      choices: [
        {
          name: 'Manga',
          value: MediaFormat.MANGA
        },
        {
          name: 'Movie',
          value: MediaFormat.MOVIE
        },
        {
          name: 'Music',
          value: MediaFormat.MUSIC
        },
        {
          name: 'Novel',
          value: MediaFormat.NOVEL
        },
        {
          name: 'ONA',
          value: MediaFormat.ONA
        },
        {
          name: 'Oneshot',
          value: MediaFormat.ONE_SHOT
        },
        {
          name: 'OVA',
          value: MediaFormat.OVA
        },
        {
          name: 'Special',
          value: MediaFormat.SPECIAL
        },
        {
          name: 'TV',
          value: MediaFormat.TV
        },
        {
          name: 'TV Short',
          value: MediaFormat.TV_SHORT
        }
      ]
    }
  ]
};

export const COMMAND_NOTIFICATION: Partial<APIApplicationCommand> = {
  name: 'notification',
  description: 'Setup notifications.',
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'airing-anime',
      description: 'Airing anime notifications.',
      type: ApplicationCommandOptionType.SubcommandGroup,
      options: [
        {
          name: 'add',
          description: 'Add an anime to notifications for airing.',
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              type: ApplicationCommandOptionType.Integer,
              name: 'media',
              description: 'The anime media.',
              required: true,
              autocomplete: true
            }
          ]
        },
        {
          name: 'remove',
          description: 'Remove an anime from notifications for airing.',
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              type: ApplicationCommandOptionType.Integer,
              name: 'media',
              description: 'The anime media.',
              required: true,
              autocomplete: true
            }
          ]
        }
      ]
    }
  ]
};

export const COMMAND_BIND_NOTIFICATION: Partial<APIApplicationCommand> = {
  name: 'bind',
  description: 'Bind notifications to the selected channel.',
  default_member_permissions: '0',
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      type: ApplicationCommandOptionType.Channel,
      channel_types: [ChannelType.GuildText, ChannelType.PublicThread, ChannelType.PrivateThread],
      name: 'channel',
      description: 'The channel to notify into.',
      required: true
    }
  ]
};

export const COMMAND_UNBIND_NOTIFICATION: Partial<APIApplicationCommand> = {
  name: 'unbind',
  description: 'Unbind notifications.',
  default_member_permissions: '0',
  type: ApplicationCommandType.ChatInput
};

export const FIND_ANIME_MESSAGE_COMMAND: Partial<APIApplicationCommand> = {
  name: 'Search Anime',
  type: ApplicationCommandType.Message
};

export const FIND_MANGA_MESSAGE_COMMAND: Partial<APIApplicationCommand> = {
  name: 'Search Manga',
  type: ApplicationCommandType.Message
};

export const FIND_STAFF_MESSAGE_COMMAND: Partial<APIApplicationCommand> = {
  name: 'Search Staff',
  type: ApplicationCommandType.Message
};

export const FIND_CHARACTER_MESSAGE_COMMAND: Partial<APIApplicationCommand> = {
  name: 'Search Character',
  type: ApplicationCommandType.Message
};

export const FIND_USER_MESSAGE_COMMAND: Partial<APIApplicationCommand> = {
  name: 'Show AniList User',
  type: ApplicationCommandType.User
};

export const commandList = [
  FIND_ANIME_MESSAGE_COMMAND,
  FIND_MANGA_MESSAGE_COMMAND,
  FIND_STAFF_MESSAGE_COMMAND,
  FIND_CHARACTER_MESSAGE_COMMAND,
  FIND_USER_MESSAGE_COMMAND,
  COMMAND_ABOUT,
  COMMAND_ANIME,
  COMMAND_FIND,
  COMMAND_MANGA,
  COMMAND_STAFF,
  COMMAND_USER,
  COMMAND_LINK,
  COMMAND_UNLINK,
  COMMAND_RANKING,
  COMMAND_CHARACTER,
  COMMAND_BIND_NOTIFICATION,
  COMMAND_UNBIND_NOTIFICATION,
  COMMAND_NOTIFICATION
];
