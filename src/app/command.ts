import { InteractionContext } from './context/interaction-context.js';

export interface CommandHandler<T extends InteractionContext> {
  ephemeral: boolean;
  handle(ctx: T): Promise<void>;
}
