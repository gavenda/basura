import { MediaType } from '@anilist/gql/types.js';
import { CommandHandler, handlePaginatorComponents } from '@studio-bogus/discord-interaction-app';
import { ComponentContext, MessageCommandContext } from '@studio-bogus/discord-interaction-app/context';
import { handleFindMedia } from '../find.js';

export class FindMangaMessageCommand implements CommandHandler<MessageCommandContext> {
  ephemeral: boolean = false;
  async handle(context: MessageCommandContext): Promise<void> {
    const query = context.message.content;
    await handleFindMedia(context, query, MediaType.MANGA);
  }

  async handleComponent(context: ComponentContext): Promise<void> {
    await handlePaginatorComponents(context);
  }
}
