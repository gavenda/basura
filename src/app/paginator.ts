import { APIEmbed } from 'discord-api-types/v10';
import { Button, ButtonStyleTypes, MessageComponent, MessageComponentTypes } from 'discord-interactions';
import { ComponentContext } from './context/component-context.js';
import { SlashCommandContext } from './context/slash-command-context.js';

export enum PaginatorButton {
  NEXT_BUTTON_ID = 'next',
  PREV_BUTTON_ID = 'prev',
}

export interface PaginatorOptions {
  context: SlashCommandContext;
  pages: APIEmbed[];
  nextButton?: Button;
  prevButton?: Button;
}

interface Pages {
  current: number;
  pages: APIEmbed[];
}

export const paginator = async (options: PaginatorOptions): Promise<void> => {
  if (options.pages.length <= 0) {
    throw new Error('No pages added!');
  }

  const defaultNextButton: Button = {
    type: MessageComponentTypes.BUTTON,
    style: ButtonStyleTypes.PRIMARY,
    label: 'Next',
  };

  const defaultPrevButton: Button = {
    type: MessageComponentTypes.BUTTON,
    style: ButtonStyleTypes.PRIMARY,
    label: 'Prev',
  };

  const nextButton = await options.context.createComponent<Button>({
    id: PaginatorButton.NEXT_BUTTON_ID,
    component: options.nextButton ?? defaultNextButton,
  });

  const prevButton = await options.context.createComponent<Button>({
    id: PaginatorButton.PREV_BUTTON_ID,
    component: options.prevButton ?? defaultPrevButton,
  });

  const components: MessageComponent[] = [
    {
      type: MessageComponentTypes.ACTION_ROW,
      components: [prevButton, nextButton],
    },
  ];

  const pagesData: Pages = {
    current: 0,
    pages: options.pages,
  };

  await options.context.edit({
    message: [options.pages[0]],
    components,
  });
  await options.context.bindData(pagesData);
};

export const handlePaginatorComponents = async (context: ComponentContext): Promise<void> => {
  const { components } = context;
  const pages = await context.messageData<Pages>();
  if (pages === null) return;

  if (context.customId === PaginatorButton.NEXT_BUTTON_ID) {
    if (pages.current >= pages.pages.length - 1) {
      pages.current = 0;
    } else {
      pages.current = pages.current + 1;
    }
  } else if (context.customId === PaginatorButton.PREV_BUTTON_ID) {
    if (pages.current === 0) {
      pages.current = pages.pages.length - 1;
    } else {
      pages.current = pages.current - 1;
    }
  }

  await context.edit({
    message: [pages.pages[pages.current]],
    components,
  });
  await context.bindData(pages);
};
