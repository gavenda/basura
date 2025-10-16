import { MessageFlags } from 'discord-api-types/v10';
import { findStaffById, findStaffNames, staffToComponents } from '../anilist/staff';
import { isBlank } from '../utils/strings';
import { ApplicationChatInputCommandHandler } from './command';

export const staff: ApplicationChatInputCommandHandler = {
  async handle(context) {
    const staffId = context.getRequiredNumber('id');
    const staff = await findStaffById({ staffId, env: context.env });

    if (!staff) {
      await context.reply({
        flags: MessageFlags.Ephemeral,
        content: 'Unable to find staff.'
      });
      return;
    }

    await context.reply({
      components: staffToComponents(staff),
      flags: MessageFlags.IsComponentsV2
    });
  },
  async handleAutocomplete(context) {
    const search = context.getRequiredString(`id`);

    if (isBlank(search)) {
      return [];
    }

    return findStaffNames({
      search,
      env: context.env
    });
  }
};
