import { APIUser, ButtonStyle, ComponentType, MessageFlags } from 'discord-api-types/payloads/v10';
import { Routes } from 'discord-api-types/rest/v10';
import { Snowflake, getDate } from 'discord-snowflake';
import { safeFetch } from '../utils/safe-fetch';
import { ApplicationChatInputCommandHandler } from './command';

const DISCORD_API_V10 = `https://discord.com/api/v10`;

export const about: ApplicationChatInputCommandHandler = {
  async handle(context) {
    const result = await safeFetch(DISCORD_API_V10 + Routes.user(), {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Basura/2.0',
        'Authorization': `Bot ${context.env.DISCORD_TOKEN}`
      }
    });
    const user = await result.json<APIUser>();
    const selfAvatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`;
    const dateCreated = getDate(user.id as Snowflake);

    const versionText = `-# Version\n2.0\n`;
    const languageText = `-# Language\n[TypeScript](https://typescriptlang.org/)\n`;
    const platformText = `-# Platform\n[Cloudflare](https://cloudflare.com/)\n`;
    const dateCreatedText = `-# Date Created\n${Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'long' }).format(dateCreated)}\n`;

    await context.reply({
      components: [
        {
          type: ComponentType.Container,
          components: [
            {
              type: ComponentType.Section,
              components: [
                {
                  type: ComponentType.TextDisplay,
                  content: `# What is Basura?`
                },
                {
                  type: ComponentType.TextDisplay,
                  content: `Basura literally means trash.`
                }
              ],
              accessory: {
                type: ComponentType.Thumbnail,
                media: {
                  url: selfAvatarUrl
                }
              }
            },
            {
              type: ComponentType.TextDisplay,
              content: versionText
            },
            {
              type: ComponentType.TextDisplay,
              content: languageText
            },
            {
              type: ComponentType.TextDisplay,
              content: platformText
            },
            {
              type: ComponentType.TextDisplay,
              content: dateCreatedText
            },
            {
              type: ComponentType.Separator
            },
            {
              type: ComponentType.Section,
              components: [
                {
                  type: ComponentType.TextDisplay,
                  content: `-# If you want to add more languages, feel free to hop on the github and submit a pull request.`
                }
              ],
              accessory: {
                type: ComponentType.Button,
                style: ButtonStyle.Link,
                label: 'GitHub',
                url: `https://github.com/gavenda/basura`
              }
            }
          ]
        }
      ],
      flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2
    });
  }
};
