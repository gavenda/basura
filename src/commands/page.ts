import { CommandHandler } from '@app/command.js';
import { ComponentContext } from '@app/context/component-context.js';
import { SlashCommandContext } from '@app/context/slash-command-context.js';
import { handlePaginatorComponents, paginator } from '@app/paginator.js';

export class PageCommand implements CommandHandler<SlashCommandContext> {
  ephemeral: boolean = true;

  async handle(context: SlashCommandContext): Promise<void> {
    const pages = [
      {
        title: `Page 1`,
        description: `Page 1!!!`,
      },
      {
        title: `Page 2`,
        description: `Page 2!!!`,
      },
      {
        title: `Page 3`,
        description: `Page 3!!!`,
      },
      {
        title: `Page 4`,
        description: `Page 4!!!`,
      },
      {
        title: `Page 5`,
        description: `Page 5!!!`,
      },
    ];

    await paginator({ context, pages });
  }

  async handleComponent(ctx: ComponentContext): Promise<void> {
    await handlePaginatorComponents(ctx);
  }
}
