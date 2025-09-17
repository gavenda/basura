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
import { verifyKey } from 'discord-interactions';
import { ApplicationCommandAutocompleteContext } from './application-command-autocomplete.context';
import { ChatInputApplicationCommandContext } from './chat-input-application-command.context';
import { appChatInputCommandMap } from './commands/command';
import { Environment } from './environment';
import { truncate } from './utils/strings';

/**
 * Represents a discord interactions application.
 */
export class Application {
  environment: Environment;

  constructor(options: { environment: Environment }) {
    this.environment = options.environment;
  }

  async handleRequest(request: Request): Promise<Response> {
    // Using the incoming headers, verify this request actually came from discord.
    const signature = request.headers.get('x-signature-ed25519');
    const timestamp = request.headers.get('x-signature-timestamp');

    if (!signature) {
      return new Response('Cannot find signature header.', { status: 400 });
    }
    if (!timestamp) {
      return new Response('Cannot find timestamp header.', { status: 400 });
    }

    const body = await request.clone().arrayBuffer();
    const isValidRequest = await verifyKey(body, signature, timestamp, this.environment.DISCORD_PUBLIC_KEY);

    if (!isValidRequest) {
      return new Response('Bad request signature.', { status: 401 });
    }

    const interaction = await request.json<APIInteraction>();

    const response = await this.handleInteraction(interaction);

    console.log(response);

    return new Response(JSON.stringify(response), {
      headers: {
        'content-type': 'application/json;charset=UTF-8'
      }
    });
  }

  async handleInteraction(interaction: APIInteraction) {
    console.log(interaction.data);

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
          if (typeof choice.value === 'string') {
            return {
              name: truncate(choice.name, 100),
              value: truncate(choice.value, 100)
            };
          }

          return {
            name: truncate(choice.name, 100),
            value: choice.value
          };
        })
        .slice(25);

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

    if (commandHandler) {
      return commandHandler.handle(context);
    }

    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: `No chat input command handler found for \`${interaction.data.name}\`.`,
        flags: MessageFlags.Ephemeral
      }
    };
  }

  async handleApplicationMessageCommand(interaction: APIMessageApplicationCommandInteraction) {}

  async handleApplicationUserCommand(interaction: APIUserApplicationCommandInteraction) {}
}
