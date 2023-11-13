import { APIEmbed } from 'discord-api-types/v10';
import { MessageComponent } from 'discord-interactions';

export interface MessageOptions {
  message: string | APIEmbed[];
  components?: MessageComponent[];
  ephmeral?: boolean;
}
