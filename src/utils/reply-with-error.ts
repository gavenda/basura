import { MessageFlags, type RepliableInteraction } from 'discord.js';
import { RateLimitedError } from '../anilist/rate-limit';
import { CacheUnavailableError } from '../cache';

/**
 * Discord shows "the application did not respond" if an interaction is left hanging,
 * so a handler that threw still owes the user a reply.
 */
export const replyWithError = async (interaction: RepliableInteraction, error: unknown): Promise<void> => {
  const content =
    error instanceof RateLimitedError
      ? `AniList is busy. Try again in ${Math.max(1, Math.ceil(error.retryAfterMs / 1000))} seconds.`
      : error instanceof CacheUnavailableError
        ? 'AniList lookups are unavailable right now. Try again shortly.'
        : 'An error occurred during the interaction.';
  const payload = { content, flags: MessageFlags.Ephemeral } as const;

  await (
    interaction.deferred || interaction.replied ? interaction.followUp(payload) : interaction.reply(payload)
  ).catch(() => {});
};
