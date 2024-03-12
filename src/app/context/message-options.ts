import { APIActionRowComponent, APIEmbed, APIMessageActionRowComponent } from 'discord-api-types/v10';

export interface MessageOptions {
  message: string | APIEmbed[];
  components?: APIActionRowComponent<APIMessageActionRowComponent>[];
  ephmeral?: boolean;
}
