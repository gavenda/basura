import {
  APIApplicationCommandAutocompleteInteraction,
  APIChatInputApplicationCommandInteraction,
  APIInteraction,
  APIInteractionResponse,
  ApplicationCommandType,
  InteractionResponseType,
  InteractionType,
  MessageFlags
} from 'discord-api-types/v10';
import { verifyKey } from 'discord-interactions';
import { commands } from './commands';
import { CommandContext } from './context';
import { sleep } from './utils/sleep';

/** How long a command can run before the user is told it timed out. */
const TIMEOUT_MS = 20_000;

const ephemeral = (content: string): APIInteractionResponse => ({
  type: InteractionResponseType.ChannelMessageWithSource,
  data: { content, flags: MessageFlags.Ephemeral }
});

const autocomplete = async (
  interaction: APIApplicationCommandAutocompleteInteraction,
  env: Env
): Promise<APIInteractionResponse> => {
  const command = commands[interaction.data.name];
  const choices = (await command?.autocomplete?.(new CommandContext(env, interaction))) ?? [];

  return {
    type: InteractionResponseType.ApplicationCommandAutocompleteResult,
    data: { choices: choices.slice(0, 25) }
  };
};

/** Defers the reply right away, then runs the command in the background and replies through the webhook. */
const runCommand = (
  interaction: APIChatInputApplicationCommandInteraction,
  env: Env,
  executionContext: ExecutionContext
): APIInteractionResponse => {
  const command = commands[interaction.data.name];

  if (!command) {
    return ephemeral(`No chat input command handler found for \`${interaction.data.name}\`.`);
  }

  const context = new CommandContext(env, interaction);

  const run = command.handle(context).catch(async (error) => {
    console.error({ message: 'Error occurred during interaction', error, interaction });
    await context.reply({ content: 'An error occurred during the interaction.', flags: MessageFlags.Ephemeral });
  });

  const timeout = sleep(TIMEOUT_MS).then(async () => {
    if (!context.replied) {
      await context.reply({ content: 'The interaction timed out.', flags: MessageFlags.Ephemeral });
    }
  });

  // Keep the worker running until the command finishes or times out.
  executionContext.waitUntil(Promise.race([run, timeout]));

  return {
    type: InteractionResponseType.DeferredChannelMessageWithSource,
    data: command.flags ? { flags: command.flags } : undefined
  };
};

const handleInteraction = async (
  interaction: APIInteraction,
  env: Env,
  executionContext: ExecutionContext
): Promise<APIInteractionResponse> => {
  switch (interaction.type) {
    // Discord sends a ping when the interactions endpoint is set up in the developer portal.
    case InteractionType.Ping:
      return { type: InteractionResponseType.Pong };
    case InteractionType.ApplicationCommandAutocomplete:
      return autocomplete(interaction, env);
    case InteractionType.ApplicationCommand:
      if (interaction.data.type === ApplicationCommandType.ChatInput) {
        return runCommand(interaction as APIChatInputApplicationCommandInteraction, env, executionContext);
      }
  }

  return ephemeral('This interaction is not supported.');
};

export default {
  async fetch(request, env, executionContext) {
    // Verify the request came from Discord using its signature headers.
    const signature = request.headers.get('x-signature-ed25519');
    const timestamp = request.headers.get('x-signature-timestamp');

    if (!signature && !timestamp) {
      return new Response(`Hello! You have reached the trashiest endpoint to ever exist. Have a cup of coffee ☕`);
    }
    if (!signature || !timestamp) {
      return new Response('Missing signature or timestamp header.', { status: 400 });
    }

    const body = await request.text();

    if (!(await verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY))) {
      return new Response('Bad request signature.', { status: 401 });
    }

    const response = await handleInteraction(JSON.parse(body) as APIInteraction, env, executionContext);
    return Response.json(response);
  }
} satisfies ExportedHandler<Env>;
