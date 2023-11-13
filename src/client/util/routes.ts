import { Snowflake, getDate } from 'discord-snowflake';
import { RequestMethod, Route } from '../types.js';

export function getRouteInformation(method: RequestMethod, endpoint: string): Route {
  if (endpoint.startsWith('/interactions/') && endpoint.endsWith('/callback')) {
    return {
      path: '/interactions/:id/:token/callback',
      identifier: 'burst',
    };
  }

  const majorIdMatch = /^\/(?:channels|guilds|webhooks)\/(\d{17,19})\/(.{68,214})/.exec(endpoint);
  // Get the major id for this route - global otherwise
  const identifier = majorIdMatch?.[1] ?? 'global';
  const baseRoute = endpoint
    // Strip out all ids
    .replaceAll(/\d{17,19}/g, ':id')
    // Strip tokens
    .replace(/\/webhooks\/:id\/(.{68,214})/, '/webhooks/:id/:token')
    // Strip out reaction as they fall under the same bucket
    .replace(/\/reactions\/(.*)/, '/reactions/:reaction');

  let exceptions = '';

  // Hard-Code Old Message Deletion Exception (2 week+ old messages are a different bucket)
  // https://github.com/discord/discord-api-docs/issues/1295
  if (method === RequestMethod.Delete && baseRoute === '/channels/:id/messages/:id') {
    const id = /\d{17,19}$/.exec(endpoint)![0]!;
    const timestamp = getDate(id as Snowflake).getDate();
    if (Date.now() - timestamp > 1_000 * 60 * 60 * 24 * 14) {
      exceptions += '/Delete Old Message';
    }
  }

  return {
    path: baseRoute + exceptions,
    identifier,
  };
}
