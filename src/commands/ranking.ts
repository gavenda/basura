import { MediaFormat, MediaSeason } from '@anilist/gql/types.js';
import { findMediaByRanking } from '@anilist/media.js';
import { CommandHandler, handlePaginatorComponents } from '@studio-bogus/discord-interaction-app';
import { ComponentContext, SlashCommandContext } from '@studio-bogus/discord-interaction-app/context';
import { sendMediaEmbed } from './find.js';

export class RankingCommand implements CommandHandler<SlashCommandContext> {
  ephemeral: boolean = false;
  async handle(context: SlashCommandContext): Promise<void> {
    const amount = context.getNumber(`amount`) ?? 10;
    const format = context.getString(`format`) ? MediaFormat[context.getString(`format`) as keyof typeof MediaFormat] : MediaFormat.TV;
    const season = context.getString(`season`) ? MediaSeason[context.getString(`season`) as keyof typeof MediaSeason] : undefined;
    const seasonYear = context.getNumber(`year`);

    const medias = await findMediaByRanking({
      amount,
      formatIn: [format],
      season,
      seasonYear,
      hentai: true,
    });

    if (medias === undefined || medias.length === 0) {
      await context.reply({
        message: `No matching rankings found based on given criteria.`,
      });
      return;
    }

    await sendMediaEmbed(context, medias);
  }

  async handleComponent(context: ComponentContext): Promise<void> {
    await handlePaginatorComponents(context);
  }
}
