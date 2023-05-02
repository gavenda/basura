import { CommandHandler, handlePaginatorComponents } from '@studio-bogus/discord-interaction-app';
import { ComponentContext, MessageCommandContext } from '@studio-bogus/discord-interaction-app/context';
import { handleFindCharacter } from '../character.js';

export class FindCharacterMessageCommand implements CommandHandler<MessageCommandContext> {
  ephemeral: boolean = false;
  async handle(context: MessageCommandContext): Promise<void> {
    const query = context.message.content;
    await handleFindCharacter(query, context);
  }

  async handleComponent(context: ComponentContext): Promise<void> {
    await handlePaginatorComponents(context);
  }
}
