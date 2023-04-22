import { CommandHandler } from '@app/command.js';
import { ComponentContext } from '@app/context/component-context.js';
import { SlashCommandContext } from '@app/context/slash-command-context.js';
import { APIEmbed } from 'discord-api-types/v10';
import { Button, ButtonStyleTypes, MessageComponent, MessageComponentTypes } from 'discord-interactions';

interface Pages {
  current: number;
  pages: APIEmbed[];
}

export class PageCommand implements CommandHandler<SlashCommandContext> {
  ephemeral: boolean = true;

  async handle(ctx: SlashCommandContext): Promise<void> {
    const pages: Pages = {
      current: 0,
      pages: [
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
      ],
    };

    const helloButton = await ctx.createComponent<Button>({
      id: 'next',
      component: {
        type: MessageComponentTypes.BUTTON,
        style: ButtonStyleTypes.PRIMARY,
        label: 'Next',
      },
    });
    const worldButton = await ctx.createComponent<Button>({
      id: 'prev',
      component: {
        type: MessageComponentTypes.BUTTON,
        style: ButtonStyleTypes.PRIMARY,
        label: 'Previous',
      },
    });

    const components: MessageComponent[] = [
      {
        type: MessageComponentTypes.ACTION_ROW,
        components: [worldButton, helloButton],
      },
    ];

    await ctx.edit([pages.pages[0]], components);
    await ctx.bindData(pages);
  }

  async handleComponent(ctx: ComponentContext): Promise<void> {
    const pages = await ctx.messageData<Pages>();
    if (pages === null) return;

    if (ctx.customId === 'next') {
      if (pages.current >= pages.pages.length - 1) {
        pages.current = 0;
      } else {
        pages.current = pages.current + 1;
      }
    } else if (ctx.customId === 'prev') {
      if (pages.current === 0) {
        pages.current = pages.pages.length - 1;
      } else {
        pages.current = pages.current - 1;
      }
    }

    await ctx.edit([pages.pages[pages.current]], ctx.components);
    await ctx.bindData(pages);
  }
}
