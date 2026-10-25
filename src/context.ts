import {
  APIApplicationCommandAutocompleteInteraction,
  APIChatInputApplicationCommandInteraction,
  APIMessageComponentInteraction,
  RESTPatchAPIInteractionOriginalResponseJSONBody,
  RESTPostAPIInteractionFollowupJSONBody,
  Routes
} from 'discord-api-types/v10';
import { discordRequest } from './discord';

interface RawOption {
  name: string;
  value?: unknown;
  options?: RawOption[];
}

/** Flattens subcommand groups and subcommands down to the options the user filled in. */
const collectOptions = (options: RawOption[] = [], values = new Map<string, unknown>()) => {
  for (const option of options) {
    if (option.options) {
      collectOptions(option.options, values);
    } else {
      values.set(option.name, option.value);
    }
  }
  return values;
};

/**
 * A slash command, autocomplete or button interaction: its options, and replying through the interaction webhook.
 * Button interactions have no options.
 */
export class CommandContext {
  readonly env: Env;
  readonly guildId: string | undefined;
  /** True once a reply has been started, so the timeout notice isn't sent on top of it. */
  replied = false;

  private readonly token: string;
  private readonly options: Map<string, unknown>;

  constructor(
    env: Env,
    interaction:
      | APIChatInputApplicationCommandInteraction
      | APIApplicationCommandAutocompleteInteraction
      | APIMessageComponentInteraction
  ) {
    this.env = env;
    this.guildId = interaction.guild_id;
    this.token = interaction.token;
    this.options = collectOptions('options' in interaction.data ? interaction.data.options : undefined);
  }

  getString(name: string): string | undefined {
    const value = this.options.get(name);
    return typeof value === 'string' ? value : undefined;
  }

  getRequiredNumber(name: string): number {
    const value = this.options.get(name);
    if (typeof value !== 'number') {
      throw new Error(`Missing number option "${name}"`);
    }
    return value;
  }

  /** Sends a follow-up message. The first one replaces the deferred "thinking" message. */
  async reply(body: RESTPostAPIInteractionFollowupJSONBody): Promise<void> {
    this.replied = true;
    await discordRequest(this.env, 'POST', Routes.webhook(this.env.DISCORD_APPLICATION_ID, this.token), body);
  }

  /** Edits the message the interaction came from, such as the card whose button was clicked. */
  async update(body: RESTPatchAPIInteractionOriginalResponseJSONBody): Promise<void> {
    this.replied = true;
    await discordRequest(
      this.env,
      'PATCH',
      Routes.webhookMessage(this.env.DISCORD_APPLICATION_ID, this.token, '@original'),
      body
    );
  }
}
