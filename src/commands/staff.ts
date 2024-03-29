import { Staff, StaffName } from '@anilist/gql/types';
import { findStaff, findStaffByName } from '@anilist/staff';
import { CommandHandler, Page, handlePaginatorComponents, paginator } from '@studio-bogus/discord-interaction-app';
import {
  ApplicationCommandContext,
  AutocompleteContext,
  ComponentContext,
  SlashCommandContext
} from '@studio-bogus/discord-interaction-app/context';
import { zip } from '@util/array';
import { EMBED_DESCRIPTION_LIMIT, EMBED_FIELD_LIMIT } from '@util/discord';
import { appendIfNotMax, htmlToMarkdown, isBlank, isNotBlank, titleCase, truncate } from '@util/strings';
import { APIApplicationCommandOptionChoice, APIEmbed, APIEmbedField } from 'discord-api-types/v10';
import { decode } from 'he';

export class StaffCommand implements CommandHandler<SlashCommandContext> {
  ephemeral: boolean = false;
  async handle(context: SlashCommandContext): Promise<void> {
    const query = context.getRequiredString(`query`);
    await handleFindStaff(query, context);
  }

  async handleAutocomplete(ctx: AutocompleteContext): Promise<APIApplicationCommandOptionChoice[]> {
    const query = ctx.getRequiredString(`query`);
    const names = await findStaffByName(query);

    return names.map((x) => {
      return {
        name: truncate(x, 100),
        value: truncate(x, 100)
      };
    });
  }

  async handleComponent(context: ComponentContext): Promise<void> {
    await handlePaginatorComponents(context);
  }
}

export const handleFindStaff = async (query: string, context: ApplicationCommandContext): Promise<void> => {
  const staffs = await findStaff(query);

  if (staffs === undefined || staffs.length === 0) {
    await context.reply({
      message: `No matching staff found.`
    });
    return;
  }

  let pageNumber = 1;
  const pages: Page[] = [];

  for (const staff of staffs) {
    pages.push({
      embed: createStaffEmbed(staff, pageNumber, staffs.length),
      link: {
        label: 'View on AniList',
        url: staff.siteUrl!
      }
    });
    pageNumber = pageNumber + 1;
  }

  await paginator({ context, pages });
};

const createStaffEmbed = (staff: Staff, pageNumber: number, pageMax: number): APIEmbed => {
  const title = staffName(staff.name);
  const fields: APIEmbedField[] = [];
  const aliases = truncate(staffAliases(staff.name), EMBED_FIELD_LIMIT);

  let charactersVoiced = '';
  let workedOn = '';
  let description = staff.description ?? 'No description found.';

  // Description operations
  // Remove spoilers
  description = description.replaceAll(/\~!.*?!\~/gs, '(spoiler removed)\n');
  // Convert html to markdown
  description = htmlToMarkdown(description);
  description = decode(description);
  description = description.trim();
  description = truncate(description, EMBED_DESCRIPTION_LIMIT);

  // Characters voiced operations
  if (staff.characters?.nodes && staff.characters?.edges) {
    const nodes = zip(staff.characters.nodes, staff.characters.edges);
    for (const pair of nodes) {
      const [node, edge] = pair;
      // Ensure not null
      if (node && edge) {
        const title = node.name?.full ?? node.name?.native;
        const appearance = `- [${title}](${node.siteUrl}) [${titleCase(edge.role || '')}]\n`;
        charactersVoiced = appendIfNotMax(charactersVoiced, appearance, EMBED_FIELD_LIMIT);
      }
    }
  }

  // Worked on operations
  if (staff.staffMedia?.nodes && staff.staffMedia?.edges) {
    const nodes = zip(staff.staffMedia.nodes, staff.staffMedia.edges);
    for (const pair of nodes) {
      const [node, edge] = pair;
      // Ensure not null
      if (node && edge) {
        const title = node.title?.english ?? node.title?.romaji ?? node.title?.native;
        const appearance = `- [${title}](${node.siteUrl}) [${edge.staffRole}]\n`;
        workedOn = appendIfNotMax(workedOn, appearance, EMBED_FIELD_LIMIT);
      }
    }
  }

  if (isNotBlank(charactersVoiced)) {
    fields.push({
      name: `Characters Voiced`,
      value: charactersVoiced,
      inline: false
    });
  }

  if (isNotBlank(workedOn)) {
    fields.push({
      name: `Worked On`,
      value: workedOn,
      inline: false
    });
  }

  if (isNotBlank(aliases)) {
    fields.push({
      name: 'Aliases',
      value: aliases,
      inline: false
    });
  }

  fields.push({
    name: `Favorites`,
    value: `${staff.favourites}`,
    inline: true
  });

  return {
    title,
    description,
    thumbnail: {
      url: staff.image?.large ?? staff.image?.medium ?? ''
    },
    author: {
      name: `ID#${staff.id}`
    },
    color: 16711680,
    fields,
    footer: {
      text: `Page ${pageNumber} / ${pageMax}`
    }
  };
};

const staffName = (name: StaffName | undefined) => {
  if (name?.native) {
    return `${name.full} (${name.native})`;
  } else {
    return name?.full;
  }
};

const staffAliases = (name: StaffName | undefined): string => {
  let aliases = '';
  const names = name as Required<StaffName>;
  const uniqueNames = [...new Set(names.alternative)];

  for (const alternateName of uniqueNames) {
    if (isBlank(alternateName)) {
      continue;
    }
    const aliasEntry = `- ${alternateName.trim()}\n`;
    aliases = appendIfNotMax(aliases, aliasEntry, EMBED_FIELD_LIMIT);
  }
  return aliases;
};
