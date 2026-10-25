import { compact } from '../utils/array';
import { titleCase } from '../utils/strings';
import { Card } from './card';
import { aniListRequest, aniListSearchRequest, CACHE_TTL, normalizeSearch } from './client';
import { aliases, descriptionToMarkdown, fuzzyDate, nameChoices } from './format';
import { findStaffNamesQuery, findStaffQuery } from './queries';
import { FindStaffNamesQuery, FindStaffQuery } from './types';

export type Staff = NonNullable<FindStaffQuery['Staff']>;

export const findStaffNames = async (search: string, env: Env) => {
  const result = await aniListSearchRequest<FindStaffNamesQuery>({
    query: findStaffNamesQuery,
    variables: { search: normalizeSearch(search) },
    env
  });
  return nameChoices(result.Page?.staff);
};

export const findStaff = async (staffId: number, env: Env): Promise<Staff | null> => {
  const result = await aniListRequest<FindStaffQuery>({
    query: findStaffQuery,
    variables: { staffId },
    env,
    cacheTtl: CACHE_TTL.details
  });
  return result.Staff;
};

export const staffToCard = (staff: Staff): Card => {
  const { name } = staff;
  const birthday = fuzzyDate(staff.dateOfBirth);

  const charactersVoiced = compact(staff.characters?.edges ?? []).map(({ node, role }) => {
    return `- [${node?.name?.full || node?.name?.native}](${node?.siteUrl}) - ${titleCase(role)}`;
  });
  const workedOn = compact(staff.staffMedia?.edges ?? []).map(({ node, staffRole }) => {
    const title = node?.title?.romaji || node?.title?.english || node?.title?.native;
    return `- [${title}](${node?.siteUrl}) - ${staffRole}`;
  });

  return {
    title: name?.full || name?.native || 'Unknown',
    subtitles: compact([
      name?.native && `Native: ${name.native}`,
      name?.alternative?.[0] && `Alternative: ${name.alternative[0]}`
    ]),
    url: staff.siteUrl,
    tags: compact([staff.gender, birthday && `🎂 ${birthday}`, `❤️ ${staff.favourites ?? 0}`]),
    thumbnail: staff.image?.large || staff.image?.medium,
    pages: [
      {
        id: 'overview',
        label: 'Overview',
        description: descriptionToMarkdown(staff.description, 'No description available.'),
        sections: [['Aliases', aliases(name?.alternative)]]
      },
      { id: 'voiced', label: 'Characters Voiced', sections: [['Characters Voiced', charactersVoiced]] },
      { id: 'works', label: 'Worked On', sections: [['Worked On', workedOn]] }
    ]
  };
};
