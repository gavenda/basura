import { APIApplicationCommand, ApplicationCommandOptionType, ApplicationCommandType } from 'discord-api-types/v10';

export const COMMAND_ABOUT: Partial<APIApplicationCommand> = {
  name: 'about',
  type: ApplicationCommandType.ChatInput,
  description: 'Literally all about the trash, me!',
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
			required: true
    },
  ],
};

export const COMMAND_UNLINK: Partial<APIApplicationCommand> = {
  name: 'unlink',
  type: ApplicationCommandType.ChatInput,
  description: 'Unlink your AniList account from your Discord account.',
};
