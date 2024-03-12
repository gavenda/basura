import { CommandHandler } from '@studio-bogus/discord-interaction-app';
import { SlashCommandContext } from '@studio-bogus/discord-interaction-app/context';
import { APIUser, Routes } from 'discord-api-types/v10';
import { Snowflake, getDate } from 'discord-snowflake';

export class AboutCommand implements CommandHandler<SlashCommandContext> {
  ephemeral: boolean = true;

  async handle(context: SlashCommandContext): Promise<void> {
    const user = await context.app.client.get<APIUser>(Routes.user());
    const dateCreated = getDate(user.id as Snowflake);
    const selfAvatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`;

    await context.edit({
      message: [
        {
          title: 'What is Basura?',
          description: `
						Basura literally means trash.

						Trash includes isekai bullshit, power leveling xianxia, wuxia, otome politics,and any that heightens your level of idiotness.

						If you want to add more languages, feel free to hop on the github and submit a pull request.
					`.trim(),
          url: `https://github.com/gavenda/basura-cloudflare-worker`,
          thumbnail: {
            url: selfAvatarUrl
          },
          fields: [
            {
              name: 'Version',
              value: '1.0',
              inline: true
            },
            {
              name: 'Language',
              value: '[TypeScript](https://typescriptlang.org/)',
              inline: true
            },
            {
              name: 'Platform',
              value: '[Cloudflare Service Workers](https://workers.cloudflare.com/)',
              inline: true
            },
            {
              name: 'Date Created',
              value: Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'long' }).format(dateCreated)
            }
          ],
          footer: {
            text: 'You can help with the development by dropping by on GitHub.',
            icon_url: `https://github.com/fluidicon.png`
          }
        }
      ]
    });
  }
}
