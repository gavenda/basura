import {
  APIActionRowComponent,
  APIButtonComponent,
  APIButtonComponentWithCustomId,
  APIEmbed,
  APIMessageActionRowComponent,
  ButtonStyle,
  ComponentType
} from 'discord-api-types/v10';
import { ApplicationCommandContext } from './context/application-command-context';
import { ComponentContext } from './context/component-context';
import { EMOJI_NEXT, EMOJI_PREV } from './emoji';

export enum PaginatorButton {
  NextButton = 'next',
  PrevButton = 'prev'
}

export interface PaginatorOptions {
  context: ApplicationCommandContext;
  pages: Page[];
  nextButton?: APIButtonComponentWithCustomId;
  prevButton?: APIButtonComponentWithCustomId;
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

  const defaultNextButton: APIButtonComponentWithCustomId = {
    custom_id: '',
    type: ComponentType.Button,
    style: ButtonStyle.Primary,
    emoji: EMOJI_NEXT,
    label: ''
  };

  const defaultPrevButton: APIButtonComponentWithCustomId = {
    custom_id: '',
    type: ComponentType.Button,
    style: ButtonStyle.Primary,
    emoji: EMOJI_PREV,
    label: ''
  };

  const page = options.pages[0];
  const buttons: APIButtonComponent[] = [];

  const nextButton = await options.context.createComponent<APIButtonComponentWithCustomId>({
    id: PaginatorButton.NextButton,
    component: options.nextButton ?? defaultNextButton
  });

  const prevButton = await options.context.createComponent<APIButtonComponentWithCustomId>({
    id: PaginatorButton.PrevButton,
    component: options.prevButton ?? defaultPrevButton
  });

  if (options.pages.length > 1) {
    buttons.push(prevButton);
    buttons.push(nextButton);
  }

  if (page.link) {
    buttons.push({
      type: ComponentType.Button,
      style: ButtonStyle.Link,
      label: page.link.label,
      url: page.link.url
    });
  }

  const components: APIActionRowComponent<APIMessageActionRowComponent>[] = [
    {
      type: ComponentType.ActionRow,
      components: buttons
    }
  ];

  const pagesData: Pages = {
    current: 0,
    pages: options.pages
  };

  await options.context.edit({
    message: [page.embed],
    components
  });
  await options.context.bindData(pagesData);
};

export const handlePaginatorComponents = async (context: ComponentContext): Promise<void> => {
  const { components } = context;
  const pages = await context.messageData<Pages>();
  if (pages === null) return;

  const button = <PaginatorButton>context.customId;

  if (button === PaginatorButton.NextButton) {
    if (pages.current >= pages.pages.length - 1) {
      pages.current = 0;
    } else {
      pages.current = pages.current + 1;
    }
  } else if (button === PaginatorButton.PrevButton) {
    if (pages.current === 0) {
      pages.current = pages.pages.length - 1;
    } else {
      pages.current = pages.current - 1;
    }
  }

  const page = pages.pages[pages.current];

  const actionRow = components.find((x) => x.type === ComponentType.ActionRow);

  // Check for action row
  if (actionRow?.type === ComponentType.ActionRow) {
    const buttonLink = actionRow.components.find(
      (x) => x.type === ComponentType.Button && x.style === ButtonStyle.Link
    );

    if (buttonLink && buttonLink.type === ComponentType.Button && buttonLink.style === ButtonStyle.Link && page.link) {
      buttonLink.label = page.link.label;
      buttonLink.url = page.link.url;
    }
  }

  await context.edit({
    message: [page.embed],
    components
  });
  await context.bindData(pages);
};
