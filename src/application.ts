import {
  APIApplicationCommandAutocompleteInteraction,
  APIApplicationCommandInteraction,
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
  MessageFlags
} from 'discord-api-types/payloads/v10';
import { Locale } from 'discord-api-types/rest/v10';
import { verifyKey } from 'discord-interactions';
import { ApplicationCommandAutocompleteContext } from './application-command-autocomplete.context';
import { ChatInputApplicationCommandContext } from './chat-input-application-command.context';
import { appChatInputCommandMap } from './commands/command';
import { sleep } from './utils/sleep';
import { truncate } from './utils/strings';

const DEFAULT_TIMEOUT_MS = 20000;

/**
 * Represents a discord interactions application.
 */
export class Application {
  env: Env;
  executionContext: ExecutionContext;

  constructor(options: { env: Env; executionContext: ExecutionContext }) {
    this.env = options.env;
    this.executionContext = options.executionContext;
  }

  async handleRequest(request: Request): Promise<Response> {
    // Using the incoming headers, verify this request actually came from discord.
    const signature = request.headers.get('x-signature-ed25519');
    const timestamp = request.headers.get('x-signature-timestamp');

    if (!signature && !timestamp) {
      return new Response(`Hello! You have reached the trashiest endpoint to ever exist. Have a cup of coffee ☕`);
    }
    if (!signature) {
      return new Response('Cannot find signature header.', { status: 400 });
    }
    if (!timestamp) {
      return new Response('Cannot find timestamp header.', { status: 400 });
    }

    const body = await request.clone().arrayBuffer();
    const isValidRequest = await verifyKey(body, signature, timestamp, this.env.DISCORD_PUBLIC_KEY);

    if (!isValidRequest) {
      return new Response('Bad request signature.', { status: 401 });
    }

    const interaction = await request.json();

    const response = await this.handleInteraction(interaction as APIInteraction);

    return new Response(JSON.stringify(response), {
      headers: {
        'content-type': 'application/json'
      }
    });
  }

  async handleInteraction(interaction: APIInteraction) {
    // Handle different types of interactions
    switch (interaction.type) {
      case InteractionType.MessageComponent:
        return this.handleMessageComponentInteraction(interaction);
      case InteractionType.ModalSubmit:
        return this.handleModalSubmitInteraction(interaction);
      case InteractionType.ApplicationCommand:
        return this.handleApplicationCommand(interaction);
      case InteractionType.ApplicationCommandAutocomplete:
        return this.handleApplicationCommandAutocomplete(interaction);
      default:
        // The `Ping` message is used during the initial webhook handshake, and is
        // required to configure the webhook in the developer portal.
        return { type: InteractionResponseType.Pong };
    }
  }

  async handleMessageComponentInteraction(interaction: APIMessageComponentInteraction) {
    return { type: InteractionResponseType.Pong };
  }

  async handleModalSubmitInteraction(interaction: APIModalSubmitInteraction) {
    return { type: InteractionResponseType.Pong };
  }

  async handleApplicationCommand(interaction: APIApplicationCommandInteraction) {
    switch (interaction.data.type) {
      case ApplicationCommandType.ChatInput:
        return this.handleApplicationChatInputCommand(interaction as APIChatInputApplicationCommandInteraction);
      case ApplicationCommandType.Message:
        return this.handleApplicationMessageCommand(interaction as APIMessageApplicationCommandInteraction);
      case ApplicationCommandType.User:
        return this.handleApplicationUserCommand(interaction as APIUserApplicationCommandInteraction);
    }

    return { type: InteractionResponseType.Pong };
  }

  async handleApplicationCommandAutocomplete(interaction: APIApplicationCommandAutocompleteInteraction) {
    const commandHandler = appChatInputCommandMap[interaction.data.name];
    const context = new ApplicationCommandAutocompleteContext(this, interaction);

    if (commandHandler?.handleAutocomplete) {
      const rawChoices = await commandHandler.handleAutocomplete(context);

      // Cleanup choices
      const choices = rawChoices
        .map((choice) => {
          if (choice.name_localizations) {
            for (const key in choice.name_localizations) {
              const locale = key as Locale;
              if (choice.name_localizations[locale]) {
                choice.name_localizations[locale] = truncate(choice.name_localizations[locale], 100);
              }
            }
          }

          if (typeof choice.value === 'string') {
            return {
              name: truncate(choice.name, 100),
              name_localizations: choice.name_localizations,
              value: truncate(choice.value, 100)
            };
          }

          return {
            name: truncate(choice.name, 100),
            name_localizations: choice.name_localizations,
            value: choice.value
          };
        })
        .slice(0, 25);

      return {
        type: InteractionResponseType.ApplicationCommandAutocompleteResult,
        data: {
          choices
        }
      };
    }

    return {
      type: InteractionResponseType.ApplicationCommandAutocompleteResult,
      data: {
        choices: []
      }
    };
  }

  async handleApplicationChatInputCommand(
    interaction: APIChatInputApplicationCommandInteraction
  ): Promise<APIInteractionResponse> {
    const commandHandler = appChatInputCommandMap[interaction.data.name];
    const context = new ChatInputApplicationCommandContext(this, interaction);

    if (!commandHandler) {
      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `No chat input command handler found for \`${interaction.data.name}\`.`,
          flags: MessageFlags.Ephemeral
        }
      };
    }

    // Timeout the interaction if it passes than given timeout
    const timeout = new Promise<void>(async (resolve, _) => {
      await sleep(DEFAULT_TIMEOUT_MS);
      // We send a message if not handled
      if (!context.handled) {
        await context.edit({
          content: `The interaction timed out.`,
          flags: MessageFlags.Ephemeral
        });
      }
      resolve();
    });

    // The actual handling
    const handling = new Promise<void>(async (resolve, _) => {
      try {
        await commandHandler.handle(context);
        context.handled = true;
      } catch (error) {
        await context.edit({
          content: `An error occured during the interaction.`,
          flags: MessageFlags.Ephemeral
        });
        console.error({ message: `Error occured during interaction`, error, interaction });
      }
      resolve();
    });

    // Handle the component interaction.
    const race = Promise.race([handling, timeout]);

    // Do not forcibly exit worker until we finish fully handling the interaction race
    this.executionContext.waitUntil(race);

    return {
      type: InteractionResponseType.DeferredChannelMessageWithSource
    };
  }

  async handleApplicationMessageCommand(interaction: APIMessageApplicationCommandInteraction) {}

  async handleApplicationUserCommand(interaction: APIUserApplicationCommandInteraction) {}
}
