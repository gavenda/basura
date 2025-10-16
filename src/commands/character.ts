import { MessageFlags } from 'discord-api-types/v10';
import { characterToComponents, findCharacterById, findCharacterNames } from '../anilist/character';
import { isBlank } from '../utils/strings';
import { ApplicationChatInputCommandHandler } from './command';

export const character: ApplicationChatInputCommandHandler = {
  async handle(context) {
    const characterId = context.getRequiredNumber('id');
    const character = await findCharacterById({ characterId, env: context.env });

    if (!character) {
      await context.reply({
        flags: MessageFlags.Ephemeral,
        content: 'Unable to find character.'
      });
      return;
    }

    await context.reply({
      components: characterToComponents(character),
      flags: MessageFlags.IsComponentsV2
    });
  },
  async handleAutocomplete(context) {
    const search = context.getRequiredString(`id`);

    if (isBlank(search)) {
      return [];
    }

    return findCharacterNames({
      search,
      env: context.env
    });
  }
};
