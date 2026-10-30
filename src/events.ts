import type { Client } from 'discord.js';
import type { AppContext } from './context';
import { autocompleteInteractionEvent } from './events/autocomplete-interaction.event';
import { buttonInteractionEvent } from './events/button-interaction.event';
import { chatInputCommandInteractionEvent } from './events/chat-input-command-interaction.event';
import { clientReadyEvent } from './events/client-ready.event';
import { errorEvent } from './events/error.event';
import type { AnyAppEvent } from './events/event';
import { logger } from './logging';

const log = logger('discord');

export const events: AnyAppEvent[] = [
  clientReadyEvent,
  errorEvent,

  chatInputCommandInteractionEvent,
  autocompleteInteractionEvent,
  buttonInteractionEvent
];

export const registerEvents = (client: Client, context: AppContext): void => {
  // Erased emitter type; see AnyAppEvent.
  const emitter = client as unknown as {
    on: (event: string, listener: (...args: never[]) => void) => void;
    once: (event: string, listener: (...args: never[]) => void) => void;
  };

  for (const appEvent of events) {
    const listener = (...args: never[]) => appEvent.execute(context, ...args);

    if (appEvent.once) emitter.once(appEvent.event, listener);
    else emitter.on(appEvent.event, listener);
  }

  log.info`registered ${events.length} event handler(s)`;
};
