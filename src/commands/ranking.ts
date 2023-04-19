import { CommandHandler } from '@app/command.js';
import { SlashCommandContext } from '@app/context/slash-command-context.js';

export class Ranking implements CommandHandler<SlashCommandContext> {
  ephemeral: boolean = false;
  async handle(ctx: SlashCommandContext): Promise<void> {
    ctx.edit(`Not supported yet!`);
  }
}
