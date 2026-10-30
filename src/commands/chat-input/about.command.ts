import { ButtonStyle, ComponentType, MessageFlags, SlashCommandBuilder } from 'discord.js';
import { version } from '../../../package.json';
import type { AppChatInputCommand } from './chat-input-command';

const SOURCE_URL = 'https://github.com/gavenda/basura';

export const aboutCommand: AppChatInputCommand = {
  name: 'about',
  data: () => new SlashCommandBuilder().setName('about').setDescription('Literally all about the trash, me!').toJSON(),

  execute: async (_context, interaction) => {
    // The interaction's client is always logged in, so its user is never null.
    const me = interaction.client.user;
    const field = (label: string, value: string) => ({
      type: ComponentType.TextDisplay as const,
      content: `-# ${label}\n${value}\n`
    });
    const created = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'long' }).format(me.createdAt);

    await interaction.reply({
      flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
      // Top-level components, with no container around them.
      components: [
        {
          type: ComponentType.Section,
          components: [
            { type: ComponentType.TextDisplay, content: '# What is Basura?' },
            { type: ComponentType.TextDisplay, content: 'Basura literally means trash.' }
          ],
          accessory: { type: ComponentType.Thumbnail, media: { url: me.displayAvatarURL({ size: 256 }) } }
        },
        field('Version', version),
        field('Language', '[TypeScript](https://typescriptlang.org/)'),
        field('Platform', '[Bun](https://bun.sh/)'),
        field('Date Created', created),
        { type: ComponentType.Separator },
        {
          type: ComponentType.Section,
          components: [
            {
              type: ComponentType.TextDisplay,
              content: '-# If you want to add more languages, feel free to hop on the github and submit a pull request.'
            }
          ],
          accessory: { type: ComponentType.Button, style: ButtonStyle.Link, label: 'GitHub', url: SOURCE_URL }
        }
      ]
    });
  }
};
