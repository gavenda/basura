import { CommandHandler } from './command.js';

export class CommandMap {
  handlers = new Map<string, CommandHandler>();

  add(name: string, command: CommandHandler) {
    this.handlers.set(name, command);
  }

  get(name: string): CommandHandler {
    const handler = this.handlers.get(name);

    if (handler) {
      return handler;
    }

    throw new Error(`Cannot find command handler for: ${name}`);
  }
}
