import {
  APIApplicationCommandOptionChoice,
  APIComponentInContainer,
  APIComponentInMessageActionRow,
  APIMessageTopLevelComponent,
  APITextDisplayComponent,
  ButtonStyle,
  ComponentType,
  Locale,
  LocalizationMap
} from 'discord-api-types/v10';
import { NodeHtmlMarkdown } from 'node-html-markdown-cloudflare';
import { zip } from '../utils/array';
import { isBlank, limitTextByParagraphs, titleCase, truncate } from '../utils/strings';
import { aniListRequest } from './anilist';
import { Query, Staff, StaffName } from './gql';
import { findStaffQuery } from './gql/find-staff';
import { findStaffNameQuery } from './gql/find-staff-name';

export const findStaffNames = async (options: {
  search: string;
  env: Env;
}): Promise<APIApplicationCommandOptionChoice[]> => {
  const { search, env } = options;
  const variables = {
    search
  };

  try {
    const result = await aniListRequest<Query>({
      query: findStaffNameQuery,
      env,
      variables
    });
    const names: APIApplicationCommandOptionChoice[] = [];
    const staffs = result?.Page?.staff ?? [];

    for (const staff of staffs) {
      if (staff?.name?.full) {
        const name = truncate(staff.name.full, 100);
        const exists = names.find((x) => x.name === name);

        if (exists) continue;

        const name_localizations: LocalizationMap = {};

        if (staff.name.native) {
          const nativeName = truncate(staff.name.native, 100);

          name_localizations[Locale.Japanese] = nativeName;
          name_localizations[Locale.Korean] = nativeName;
          name_localizations[Locale.ChineseCN] = nativeName;
          name_localizations[Locale.ChineseTW] = nativeName;
        }

        names.push({
          name,
          name_localizations,
          value: staff.id
        });
      }
    }

    return names;
  } catch (error) {
    console.error({ message: `Error when finding staff names`, error });
    return [];
  }
};

export const findStaffById = async (options: { staffId: number; env: Env }): Promise<Staff | undefined> => {
  const { staffId, env } = options;
  const variables = {
    staffId
  };

  try {
    const result = await aniListRequest<Query>({
      query: findStaffQuery,
      env,
      variables
    });
    return result?.Staff;
  } catch (error) {
    console.error({ message: `Error when finding staff`, error });
  }
};

export const staffToComponents = (staff: Staff): APIMessageTopLevelComponent[] => {
  // TITLE START

  const titleComponents: APITextDisplayComponent[] = [];

  titleComponents.push({
    type: ComponentType.TextDisplay,
    content: `## ${staff.name?.full || staff.name?.native}`
  });

  const altNames: string[] = [];

  if (staff.name?.native) {
    altNames.push(`-# _(Native: ${staff.name.native})_`);
  }

  if (staff.name?.alternative && staff.name.alternative.length > 0) {
    altNames.push(`-# _(Alternative: ${staff.name?.alternative[0]})_`);
  }

  if (altNames.length > 0) {
    titleComponents.push({
      type: ComponentType.TextDisplay,
      content: altNames.join('\n')
    });
  }

  // TITLE END

  // TAGS START

  const actionRowComponents: APIComponentInMessageActionRow[] = [];

  if (staff.gender) {
    actionRowComponents.push({
      custom_id: 'staff:gender',
      type: ComponentType.Button,
      style: ButtonStyle.Secondary,
      label: staff.gender,
      disabled: true
    });
  }

  if (staff.dateOfBirth) {
    const yearNum = staff.dateOfBirth.year || 0;
    const dayNum = staff.dateOfBirth.day;
    const date = new Date(yearNum, staff.dateOfBirth.month! - 1, staff.dateOfBirth.day);

    const month = date.toLocaleString('default', { month: 'long' });
    let day: string = '';

    if (dayNum) {
      if (dayNum > 3 && dayNum < 21) {
        day = dayNum + 'th';
      } else {
        switch (dayNum % 10) {
          case 1:
            day = dayNum + 'st';
            break;
          case 2:
            day = dayNum + 'nd';
            break;
          case 3:
            day = dayNum + 'rd';
            break;
          default:
            day = dayNum + 'th';
        }
      }
    }

    const temp = [];

    if (day) {
      temp.push(day);
    }
    if (month) {
      temp.push(month);
    }
    if (yearNum) {
      temp.push(yearNum);
    }

    actionRowComponents.push({
      custom_id: 'staff:birthday',
      type: ComponentType.Button,
      style: ButtonStyle.Secondary,
      label: `🎂 ${temp.join(' ')}`,
      disabled: true
    });
  }

  actionRowComponents.push({
    custom_id: 'staff:favorite',
    type: ComponentType.Button,
    style: ButtonStyle.Secondary,
    label: `❤️ ${staff.favourites}`,
    disabled: true
  });

  // TAGS END

  // DESCRIPTION START

  const descriptions: string[] = [];

  const sourceRegex = /^(\(Source: .*\))$/gm;
  const headingRegex = /^(?:\*\*)(.*)(?:\*\*)/gm;

  if (staff.description) {
    descriptions.push(
      NodeHtmlMarkdown.translate(staff.description)
        .replaceAll(sourceRegex, (replace) => `-# ${replace}`)
        .replaceAll(headingRegex, (_, replace) => `-# ${replace}`)
    );
  } else {
    descriptions.push('No description available.');
  }

  // DESCRIPTION END

  // DETAILS START

  const details: string[] = [];

  // Characters voiced operations
  const charactersVoiced: string[] = [];

  if (staff.characters?.nodes && staff.characters?.edges) {
    const nodes = zip(staff.characters.nodes, staff.characters.edges);
    for (const pair of nodes.slice(0, 5)) {
      const [node, edge] = pair;

      // Ensure not null
      if (node && edge) {
        const title = node.name?.full ?? node.name?.native;
        const role = edge.role || '';

        charactersVoiced.push(`- [${title}](${node.siteUrl}) - ${titleCase(role)}`);
      }
    }
  }

  // Worked on operations
  const workedOn: string[] = [];

  if (staff.staffMedia?.nodes && staff.staffMedia?.edges) {
    const nodes = zip(staff.staffMedia.nodes, staff.staffMedia.edges);
    for (const pair of nodes.slice(0, 5)) {
      const [node, edge] = pair;

      // Ensure not null
      if (node && edge) {
        const title = node.title?.romaji ?? node.title?.english ?? node.title?.native;

        workedOn.push(`- [${title}](${node.siteUrl}) - ${edge.staffRole}`);
      }
    }
  }

  // Apply aliases
  const aliases = staffAliases(staff.name);

  if (aliases.length > 0) {
    details.push(`-# Aliases\n${aliases.join('\n')}`);
  }

  if (charactersVoiced.length > 0) {
    details.push(`-# Characters Voiced\n${charactersVoiced.join('\n')}`);
  }

  if (workedOn.length > 0) {
    details.push(`-# Worked On\n${workedOn.join('\n')}`);
  }

  // DETAILS END

  // CONTAINER BUILD START

  const components: APIComponentInContainer[] = [];
  const descriptionComponents: APITextDisplayComponent[] = [];

  // Title
  components.push({
    type: ComponentType.Section,
    components: titleComponents,
    accessory: {
      type: ComponentType.Button,
      style: ButtonStyle.Link,
      label: 'AniList',
      url: `${staff.siteUrl}`
    }
  });

  // Tags
  if (actionRowComponents.length > 0) {
    components.push({
      type: ComponentType.ActionRow,
      components: actionRowComponents
    });
  }

  // Seperator
  components.push({
    type: ComponentType.Separator
  });

  // Description
  components.push({
    type: ComponentType.Section,
    components: [
      {
        type: ComponentType.TextDisplay,
        content: limitTextByParagraphs(descriptions.join('\n\n'), 2000)
      }
    ],
    accessory: {
      type: ComponentType.Thumbnail,
      media: {
        url: `${staff.image?.large || staff.image?.medium}`
      }
    }
  });

  // Details
  components.push({
    type: ComponentType.TextDisplay,
    content: details.join('\n\n')
  });

  // CONTAINER BUILD END

  return [
    {
      type: ComponentType.Container,
      components
    }
  ];
};

const staffAliases = (name: StaffName | undefined): string[] => {
  const aliases: string[] = [];
  const names = name as Required<StaffName>;
  const uniqueNames = [...new Set(names.alternative.slice(1))];

  for (const alternateName of uniqueNames.slice(0, 5)) {
    if (isBlank(alternateName)) {
      continue;
    }

    aliases.push(`- ${alternateName.trim()}`);
  }
  return aliases;
};
