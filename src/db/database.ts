import { AnimeAiringScheduleTable, UserTable } from './tables.js';

export interface Database {
  anilist_user: UserTable;
  anilist_anime_airing_schedule: AnimeAiringScheduleTable;
}
