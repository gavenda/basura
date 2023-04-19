import {
	APIApplicationCommandInteractionDataOption,
	APIChatInputApplicationCommandInteraction,
	APIChatInputApplicationCommandInteractionData,
	APIEmbed,
	APIInteraction,
	ApplicationCommandOptionType
} from 'discord-api-types/v10';
import { App } from './app.js';
import { Webhook } from './webhook.js';

export class InteractionContext {
  public app: App;
  public id: string;
  public token: string;

  private interaction: APIInteraction;
  private webhook: Webhook;

  userId?: string;
  guildId?: string;
  messageId?: string;

  constructor(app: App, interaction: APIInteraction) {
    this.app = app;
    this.id = interaction.id;
    this.token = interaction.token;
    this.userId = interaction.member?.user.id ?? interaction.user?.id;
    this.guildId = interaction.guild_id;
    this.interaction = interaction;
    this.webhook = new Webhook(this.app.id, this.token);
  }

  private getOption(name: string): APIApplicationCommandInteractionDataOption {
    const interaction = this.interaction as APIChatInputApplicationCommandInteraction;
    const data = interaction.data as APIChatInputApplicationCommandInteractionData;

    if (data.options) {
      const option = data.options.find((x) => x.name === name);

      if (option) {
        return option;
      }
    }
    throw new Error(`Cannot find option: ${name}`);
  }

  getOptionString(name: string): string {
    const option = this.getOption(name);
    if (option && option.type === ApplicationCommandOptionType.String) {
      return option.value;
    }
    throw new Error(`Option ${name} is not a string`);
  }

  async edit(message: string | APIEmbed[]) {
    if (this.messageId) {
      await this.webhook.edit(message, this.messageId);
    } else {
      const followUp = await this.webhook.followUp(message);
      this.messageId = followUp.id;
    }
  }
}
