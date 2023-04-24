import { CommandHandler } from '@app/command.js';
import { ComponentContext } from '@app/context/component-context.js';
import { MessageCommandContext } from '@app/context/message-command-context.js';
import { handlePaginatorComponents } from '@app/paginator.js';
import { handleFindStaff } from '../staff.js';

export class FindStaffMessageCommand implements CommandHandler<MessageCommandContext> {
  ephemeral: boolean = true;
  async handle(context: MessageCommandContext): Promise<void> {
    const query = context.message.content;
    await handleFindStaff(query, context);
  }

  async handleComponent(context: ComponentContext): Promise<void> {
    await handlePaginatorComponents(context);
  }
}
