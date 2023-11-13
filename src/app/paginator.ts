import { APIEmbed } from 'discord-api-types/v10';
import { Button, ButtonStyleTypes, MessageComponent, MessageComponentTypes } from 'discord-interactions';
import { ApplicationCommandContext } from './context/application-command-context.js';
import { ComponentContext } from './context/component-context.js';
import { EMOJI_NEXT, EMOJI_PREV } from './emoji.js';

export enum PaginatorButton {
  NEXT_BUTTON_ID = 'next',
  PREV_BUTTON_ID = 'prev',
}

export interface PaginatorOptions {
  context: ApplicationCommandContext;
  pages: Page[];
  nextButton?: Button;
  prevButton?: Button;
}

interface LinkOptions {
  label: string;
  url: string;
}

export interface Page {
  embed: APIEmbed;
  link?: LinkOptions;
}

interface Pages {
  current: number;
  pages: Page[];
}

export const paginator = async (options: PaginatorOptions): Promise<void> => {
  if (options.pages.length <= 0) {
    throw new Error('No pages added!');
  }

  const defaultNextButton: Button = {
    type: MessageComponentTypes.BUTTON,
    style: ButtonStyleTypes.PRIMARY,
    emoji: EMOJI_NEXT,
    label: '',
  };

  const defaultPrevButton: Button = {
    type: MessageComponentTypes.BUTTON,
    style: ButtonStyleTypes.PRIMARY,
    emoji: EMOJI_PREV,
    label: '',
  };

  const page = options.pages[0];
  const buttons: Button[] = [];

  const nextButton = await options.context.createComponent<Button>({
    id: PaginatorButton.NEXT_BUTTON_ID,
    component: options.nextButton ?? defaultNextButton,
  });

  const prevButton = await options.context.createComponent<Button>({
    id: PaginatorButton.PREV_BUTTON_ID,
    component: options.prevButton ?? defaultPrevButton,
  });

  if (options.pages.length > 1) {
    buttons.push(prevButton);
    buttons.push(nextButton);
  }

  if (page.link) {
    buttons.push({
      type: MessageComponentTypes.BUTTON,
      style: ButtonStyleTypes.LINK,
      label: page.link.label,
      url: page.link.url,
    });
  }

  const components: MessageComponent[] = [
    {
      type: MessageComponentTypes.ACTION_ROW,
      components: buttons,
    },
  ];

  const pagesData: Pages = {
    current: 0,
    pages: options.pages,
  };

  await options.context.edit({
    message: [page.embed],
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

  const page = pages.pages[pages.current];

  const actionRow = components.find((x) => x.type === MessageComponentTypes.ACTION_ROW);

  // Check for action row
  if (actionRow?.type === MessageComponentTypes.ACTION_ROW) {
    const buttonLink = actionRow.components.find((x) => x.type === MessageComponentTypes.BUTTON && x.style === ButtonStyleTypes.LINK);

    if (buttonLink && buttonLink.type === MessageComponentTypes.BUTTON && page.link) {
      buttonLink.label = page.link.label;
      buttonLink.url = page.link.url;
    }
  }

  await context.edit({
    message: [page.embed],
    components,
  });
  await context.bindData(pages);
};
