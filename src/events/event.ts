import type { Awaitable, ClientEvents } from 'discord.js';
import type { AppContext } from '../context';

export interface AppEvent<DiscordEvent extends keyof ClientEvents> {
  event: DiscordEvent;
  once: boolean;
  execute: (context: AppContext, ...args: ClientEvents[DiscordEvent]) => Awaitable<void>;
}

/**
 * The registry holds events of different kinds. Enumerating them as a union of every
 * `AppEvent<E>` overflows the checker (discord.js has a hundred-odd events), so the
 * registry sees an erased view instead. `never[]` accepts any concrete argument list by
 * contravariance, which is what lets a typed `AppEvent<E>` slot in unchanged — the
 * event files themselves stay fully checked against their own arguments.
 */
export interface AnyAppEvent {
  event: keyof ClientEvents;
  once: boolean;
  execute: (context: AppContext, ...args: never[]) => Awaitable<void>;
}
