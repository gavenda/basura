import { ButtonStyle, ComponentType, InteractionResponseType, MessageFlags } from 'discord-api-types/payloads/v10';
import { ApplicationChatInputCommandHandler } from './command';

export const about: ApplicationChatInputCommandHandler = {
  async handle(context) {
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
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
              },
              {
                type: ComponentType.TextDisplay,
                content: `Trash includes isekai bullshit, power leveling xianxia, wuxia, otome politics,and any that heightens your level of idiotness.`
              }
            ],
            accessory: {
              type: ComponentType.Thumbnail,
              media: {
                url: `https://cdn.discordapp.com/avatars/911875737999527956/b35c065611d96962ecb56497ec0b7cf4?size=1024`
              }
            }
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
        ],
        flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2
      }
    };
  }
};
