import { InteractionContext } from './interaction-context.js';

export interface CommandHandler {
  handle(ctx: InteractionContext): Promise<void>;
}
