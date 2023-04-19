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
import { CommandHandler } from './command.js';
import { InteractionContext } from './context/interaction-context.js';
import { MessageCommandContext } from './context/message-command-context.js';
import { SlashCommandContext } from './context/slash-command-context.js';
import { UserCommandContext } from './context/user-command-context.js';
import { AutocompleteContext } from './context/autocomplete-context.js';

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
  public executionContext: ExecutionContext;

  constructor(options: AppOptions) {
    this.environment = options.environment;
    this.id = options.id;
    this.token = options.token;
    this.publicKey = options.publicKey;
    this.executionContext = options.executionContext;
    this.commandMap = options.commands;
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

    try {
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
    } catch (err) {
      console.error(err);
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
  async handleMessageComponentInteraction(
    interaction: APIMessageComponentInteraction
  ): Promise<APIInteractionResponse> {
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        flags: MessageFlags.Ephemeral,
        content: 'Unsupported interaction.',
      },
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

    // Do not forcibly exit worker until we finish fully handling the interaction
    this.executionContext.waitUntil(handler.handle(context));
    // Respond immediately before interaction finishes handling.
    return initialResponse;
  }

  async handleApplicationCommandAutocomplete(
    interaction: APIApplicationCommandAutocompleteInteraction
  ): Promise<APIInteractionResponse> {
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
