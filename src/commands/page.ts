import { CommandHandler } from '@app/command.js';
import { ComponentContext } from '@app/context/component-context.js';
import { SlashCommandContext } from '@app/context/slash-command-context.js';
import { ButtonStyleTypes, MessageComponent, MessageComponentTypes } from 'discord-interactions';

export class PageCommand implements CommandHandler<SlashCommandContext> {
  ephemeral: boolean = true;

  components: MessageComponent[] = [
    {
      type: MessageComponentTypes.ACTION_ROW,
      components: [
        {
          type: MessageComponentTypes.BUTTON,
          custom_id: 'world',
          style: ButtonStyleTypes.PRIMARY,
          label: 'World!',
        },
      ],
    },
  ];

  async handle(ctx: SlashCommandContext): Promise<void> {
    await ctx.editWithComponents(`Hello!`, this.components);
  }

  async handleComponent(ctx: ComponentContext): Promise<void> {
    if (ctx.customId === 'world') {
      await ctx.edit(`World!`);
    }
  }
}
