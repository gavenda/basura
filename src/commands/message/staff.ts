import { CommandHandler, handlePaginatorComponents } from '@studio-bogus/discord-interaction-app';
import { ComponentContext, MessageCommandContext } from '@studio-bogus/discord-interaction-app/context';
import { handleFindStaff } from '../staff.js';

export class FindStaffMessageCommand implements CommandHandler<MessageCommandContext> {
  ephemeral: boolean = false;
  async handle(context: MessageCommandContext): Promise<void> {
    const query = context.message.content;
    await handleFindStaff(query, context);
  }

  async handleComponent(context: ComponentContext): Promise<void> {
    await handlePaginatorComponents(context);
  }
}
