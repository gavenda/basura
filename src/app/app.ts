import {
  APIInteraction,
  APIInteractionResponse,
  InteractionResponseType,
  InteractionType,
  MessageFlags,
} from 'discord-api-types/v10';
import { verifyKey } from 'discord-interactions';
import { CommandMap } from './command-map.js';
import { CommandHandler } from './command.js';
import { InteractionContext } from './interaction-context.js';

export interface AppOptions {
  token: string;
  id: string;
  publicKey: string;
  env: any;
  ctx: ExecutionContext;
  commands: { [name: string]: CommandHandler };
}

export class App {
  private _env: any;
  private commandMap = new CommandMap();

  /**
   * Application public key.
   */
  public publicKey: string;
  /**
   * Application identifier.
   */
  public id: string;

  /**
   * Application token.
   */
  public token: string;

  /**
   * The cloudflare service worker execution context.
   */
  public ctx: ExecutionContext;

  constructor(options: AppOptions) {
    this._env = options.env;
    this.id = options.id;
    this.token = options.token;
    this.publicKey = options.publicKey;
    this.ctx = options.ctx;

    for (const command of Object.keys(options.commands)) {
      this.commandMap.add(command, options.commands[command]);
    }
  }

  /**
   * The environment variables/secrets that come from cloudflare service worker.
   * @returns
   */
  env<T>() {
    return this._env as T;
  }

  /**
   * Checks if the request is valid by checking signature headers coming from discord.
   * @param request request to check
   * @returns true if valid, else false
   */
  async isRequestValid(request: Request): Promise<boolean> {
    // Using the incoming headers, verify this request actually came from discord.
    const signature = request.headers.get('x-signature-ed25519');
    const timestamp = request.headers.get('x-signature-timestamp');

    if (!signature) {
      throw new Error('Cannot find signature header.');
    }
    if (!timestamp) {
      throw new Error('Cannot find timestamp header.');
    }

    const body = await request.clone().arrayBuffer();
    return verifyKey(body, signature, timestamp, this.publicKey);
  }

  async handleInteraction(
    interaction: APIInteraction
  ): Promise<[Promise<APIInteractionResponse>, Promise<void>]> {
    if (interaction.type === InteractionType.Ping) {
      // The `PING` message is used during the initial webhook handshake, and is
      // required to configure the webhook in the developer portal.
      return [
        Promise.resolve({ type: InteractionResponseType.Pong }),
        Promise.resolve(),
      ];
    }
    if (interaction.type === InteractionType.ApplicationCommand) {
      try {
        const handler = this.commandMap.get(interaction.data.name);
        const context = new InteractionContext(this, interaction);

        return [
          Promise.resolve({
            type: InteractionResponseType.DeferredChannelMessageWithSource,
            data: {
              flags: MessageFlags.Ephemeral,
            },
          }),
          handler.handle(context),
        ];
      } catch (err) {
        console.error(err);

        return [
          Promise.resolve({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
              flags: MessageFlags.Ephemeral,
              content: 'There was an error processing the interaction.',
            },
          }),
          Promise.resolve(),
        ];
      }
    }

    throw Error('Unknown interaction type.');
  }
}
