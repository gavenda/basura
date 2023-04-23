import { Client } from '@client/client.js';
import { KVBucketManager } from '@client/kv-bucket-manager.js';
import { RedisBucketManager } from '@client/redis-bucket-manager.js';
import { Redis } from '@upstash/redis';
import {
  APIApplicationCommandAutocompleteInteraction,
  APIApplicationCommandInteraction,
  APIApplicationCommandOptionChoice,
  APIChatInputApplicationCommandInteraction,
  APIInteraction,
  APIInteractionResponse,
  APIMessageApplicationCommandInteraction,
  APIMessageComponentInteraction,
  APIModalSubmitInteraction,
  APIUserApplicationCommandInteraction,
  ApplicationCommandType,
  InteractionResponseType,
  InteractionType,
  MessageFlags,
} from 'discord-api-types/v10';
import { verifyKey } from 'discord-interactions';
import { Cache, DefaultCache, KVCache, RedisCache } from './cache.js';
import { CommandHandler } from './command.js';
import { AutocompleteContext } from './context/autocomplete-context.js';
import { ComponentContext } from './context/component-context.js';
import { InteractionContext } from './context/interaction-context.js';
import { MessageCommandContext } from './context/message-command-context.js';
import { SlashCommandContext } from './context/slash-command-context.js';
import { UserCommandContext } from './context/user-command-context.js';
import { sleep } from './time.js';

export interface CommandMap {
  [name: string]: CommandHandler<InteractionContext>;
}

export interface AppOptions {
  /**
   * Application token.
   */
  token: string;
  /**
   * Application identifier.
   */
  id: string;
  /**
   * Application public key.
   */
  publicKey: string;
  /**
   * Cloudflare service worker.
   */
  environment: any;
  /**
   * Cloudflare execution context.
   */
  executionContext: ExecutionContext;
  /**
   * Command handlers.
   */
  commands: CommandMap;
  /**
   * The number in milliseconds before any interaction is deemed timed out.
   */
  timeoutMs?: number;
  /**
   * Namespace for buckets, optional.
   */
  bucketNamespace?: KVNamespace;
  /**
   * Namespace for cache, optional.
   */
  cacheNamespace?: KVNamespace;
  /**
   * Message cache ttl, defaults to 3600
   */
  messageCacheTtl?: number;
  /**
   * Component cache ttl, defaults to 86400
   */
  componentTtl?: number;
  /**
   * Redis client.
   */
  redis?: Redis;
}

/**
 * Discord cloudflare service worker application.
 */
export class App {
  private environment: any;
  private commandMap: CommandMap = {};

  /**
   * Application public key.
   */
  publicKey: string;
  /**
   * Application identifier.
   */
  id: string;

  /**
   * Application token.
   */
  token: string;

  /**
   * The cloudflare service worker execution context.
   */
  executionContext: ExecutionContext;

  /**
   * The number in milliseconds before any interaction is deemed timed out.
   */
  timeoutMs: number;

  /**
   * Application REST client.
   */
  rest: Client;

  /**
   * Component cache.
   */
  componentCache: Cache;
  /**
   * Message cache.
   */
  messageCache: Cache;

  constructor(options: AppOptions) {
    this.environment = options.environment;
    this.id = options.id;
    this.token = options.token;
    this.publicKey = options.publicKey;
    this.executionContext = options.executionContext;
    this.commandMap = options.commands;
    this.timeoutMs = options.timeoutMs ?? 20000;
    this.componentCache = new DefaultCache();
    this.messageCache = new DefaultCache();
    this.rest = new Client().setToken(options.token);

    if (options.redis) {
      const bucketManager = new RedisBucketManager(options.redis);
      this.rest = new Client({ bucketManager }).setToken(options.token);
    } else if (options.bucketNamespace) {
      const bucketManager = new KVBucketManager(options.bucketNamespace);
      this.rest = new Client({ bucketManager }).setToken(options.token);
    }

    if (options.redis) {
      this.componentCache = new RedisCache(options.redis, options.componentTtl ?? 86400);
      this.messageCache = new RedisCache(options.redis, options.messageCacheTtl ?? 3600);
    } else if (options.cacheNamespace) {
      this.componentCache = new KVCache(options.cacheNamespace, options.componentTtl ?? 86400);
      this.messageCache = new KVCache(options.cacheNamespace, options.messageCacheTtl ?? 3600);
    }
  }

  /**
   * The environment variables/secrets that come from cloudflare service worker.
   * @returns
   */
  env<T>() {
    return this.environment as T;
  }

  /**
   * Handles incoming discord interaction requests.
   * @param request request
   * @returns
   */
  async handle(request: Request) {
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
    const requestValid = verifyKey(body, signature, timestamp, this.publicKey);

    if (!requestValid) {
      return new Response('Bad request signature.', { status: 401 });
    }

    const interaction = await request.json<APIInteraction>();
    const interactionResponse = await this.handleInteraction(interaction);

    return new Response(JSON.stringify(interactionResponse), {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    });
  }

  async handleInteraction(interaction: APIInteraction): Promise<APIInteractionResponse> {
    if (interaction.type === InteractionType.Ping) {
      // The `Ping` message is used during the initial webhook handshake, and is
      // required to configure the webhook in the developer portal.
      return { type: InteractionResponseType.Pong };
    }

    if (interaction.type === InteractionType.MessageComponent) {
      return this.handleMessageComponentInteraction(interaction);
    }
    if (interaction.type === InteractionType.ModalSubmit) {
      return this.handleModalSubmitInteraction(interaction);
    }
    if (interaction.type === InteractionType.ApplicationCommand) {
      return this.handleApplicationCommand(interaction);
    }
    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
      return this.handleApplicationCommandAutocomplete(interaction);
    }

    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        flags: MessageFlags.Ephemeral,
        content: 'Cannot process the interaction.',
      },
    };
  }

  /**
   * Handles all modal interactions.
   * @param interaction
   * @returns
   */
  async handleModalSubmitInteraction(interaction: APIModalSubmitInteraction): Promise<APIInteractionResponse> {
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        flags: MessageFlags.Ephemeral,
        content: 'Unsupported interaction.',
      },
    };
  }

  /**
   * Handles all message component interactions.
   * @param interaction
   * @returns
   */
  async handleMessageComponentInteraction(interaction: APIMessageComponentInteraction): Promise<APIInteractionResponse> {
    const context = new ComponentContext(this, interaction);
    // Lookup handler for command
    const handler = this.commandMap[context.command];

    if (!handler) {
      return {
        type: InteractionResponseType.UpdateMessage,
        data: {
          flags: MessageFlags.Ephemeral,
          content: 'No command handler for this component.',
        },
      };
    }

    // Timeout the interaction if it passes than given timeout
    const timeout = new Promise<void>(async (resolve, _) => {
      await sleep(this.timeoutMs);
      // We send a message if not handled
      if (!context.handled) {
        await context.edit({
          message: `The interaction timed out.`,
          ephmeral: true,
        });
      }
      resolve();
    });

    // The actual handling
    const handling = new Promise<void>(async (resolve, _) => {
      try {
        if (handler.handleComponent) {
          context.handled = true;
          await handler.handleComponent(context);
        } else {
          await context.edit({
            message: `No component handlers found.`,
            ephmeral: true,
          });
        }
      } catch (err) {
        await context.edit({
          message: `An error occured during the interaction.`,
          ephmeral: true,
        });
        console.error(err);
      }
      resolve();
    });

    // Handle the component interaction.
    const race = Promise.race([handling, timeout]);

    // Do not forcibly exit worker until we finish fully handling the interaction race
    this.executionContext.waitUntil(race);

    return {
      type: InteractionResponseType.DeferredMessageUpdate,
    };
  }

  /**
   * Handles all application command interactions.
   * @param interaction
   * @returns
   */
  async handleApplicationCommand(interaction: APIApplicationCommandInteraction): Promise<APIInteractionResponse> {
    const initialResponse: Required<APIInteractionResponse> = {
      type: InteractionResponseType.DeferredChannelMessageWithSource,
      data: {},
    };

    let handler: CommandHandler<InteractionContext>;
    let context: InteractionContext;

    // There are three different application command types, handle each of them with different contexts
    switch (interaction.data.type) {
      case ApplicationCommandType.ChatInput:
        context = new SlashCommandContext(this, interaction as APIChatInputApplicationCommandInteraction);
        handler = this.commandMap[interaction.data.name];
        break;
      case ApplicationCommandType.Message:
        context = new MessageCommandContext(this, interaction as APIMessageApplicationCommandInteraction);
        handler = this.commandMap[interaction.data.name];
      case ApplicationCommandType.User:
        context = new UserCommandContext(this, interaction as APIUserApplicationCommandInteraction);
        handler = this.commandMap[interaction.data.name];
    }

    if (!handler) {
      console.error(`No handlers found for command: ${interaction.data.name}`);
      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          flags: MessageFlags.Ephemeral,
          content: 'No handlers found for this command.',
        },
      };
    }

    if (handler.ephemeral) {
      initialResponse.data.flags = MessageFlags.Ephemeral;
    }

    // Timeout the interaction if it passes than given timeout
    const timeout = new Promise<void>(async (resolve, _) => {
      await sleep(this.timeoutMs);
      // We send a message if not handled
      if (!context.handled) {
        await context.edit({
          message: `The interaction timed out.`,
          ephmeral: true,
        });
      }
      resolve();
    });

    // The actual handling
    const handling = new Promise<void>(async (resolve, _) => {
      try {
        await handler.handle(context);
        context.handled = true;
      } catch (err) {
        await context.edit({
          message: `An error occured during the interaction.`,
          ephmeral: true,
        });
        console.error(err);
      }
      resolve();
    });

    const race = Promise.race([handling, timeout]);

    // Do not forcibly exit worker until we finish fully handling the interaction race
    this.executionContext.waitUntil(race);

    // Respond immediately before interaction finishes handling.
    return initialResponse;
  }

  async handleApplicationCommandAutocomplete(interaction: APIApplicationCommandAutocompleteInteraction): Promise<APIInteractionResponse> {
    const handler = this.commandMap[interaction.data.name];
    const context = new AutocompleteContext(this, interaction);

    let choices: APIApplicationCommandOptionChoice[] = [];

    if (handler.handleAutocomplete) {
      choices = await handler.handleAutocomplete(context);
    }

    return {
      type: InteractionResponseType.ApplicationCommandAutocompleteResult,
      data: {
        choices: choices.slice(0, 25),
      },
    };
  }
}
