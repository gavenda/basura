export type Maybe<T> = T;
export type InputMaybe<T> = T;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** ISO 3166-1 alpha-2 country code */
  CountryCode: string;
  /** 8 digit long date integer (YYYYMMDD). Unknown dates represented by 0. E.g. 2016: 20160000, May 1976: 19760500 */
  FuzzyDateInt: number;
  Json: unknown;
};

/** Notification for when a activity is liked */
export type ActivityLikeNotification = {
  __typename?: 'ActivityLikeNotification';
  /** The id of the Notification */
  id: Scalars['Int'];
  /** The id of the user who liked to the activity */
  userId: Scalars['Int'];
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The id of the activity which was liked */
  activityId: Scalars['Int'];
  /** The notification context text */
  context?: Maybe<Scalars['String']>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars['Int']>;
  /** The liked activity */
  activity?: Maybe<ActivityUnion>;
  /** The user who liked the activity */
  user?: Maybe<User>;
};

/** Notification for when authenticated user is @ mentioned in activity or reply */
export type ActivityMentionNotification = {
  __typename?: 'ActivityMentionNotification';
  /** The id of the Notification */
  id: Scalars['Int'];
  /** The id of the user who mentioned the authenticated user */
  userId: Scalars['Int'];
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The id of the activity where mentioned */
  activityId: Scalars['Int'];
  /** The notification context text */
  context?: Maybe<Scalars['String']>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars['Int']>;
  /** The liked activity */
  activity?: Maybe<ActivityUnion>;
  /** The user who mentioned the authenticated user */
  user?: Maybe<User>;
};

/** Notification for when a user is send an activity message */
export type ActivityMessageNotification = {
  __typename?: 'ActivityMessageNotification';
  /** The id of the Notification */
  id: Scalars['Int'];
  /** The if of the user who send the message */
  userId: Scalars['Int'];
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The id of the activity message */
  activityId: Scalars['Int'];
  /** The notification context text */
  context?: Maybe<Scalars['String']>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars['Int']>;
  /** The message activity */
  message?: Maybe<MessageActivity>;
  /** The user who sent the message */
  user?: Maybe<User>;
};

/** Replay to an activity item */
export type ActivityReply = {
  __typename?: 'ActivityReply';
  /** The id of the reply */
  id: Scalars['Int'];
  /** The id of the replies creator */
  userId?: Maybe<Scalars['Int']>;
  /** The id of the parent activity */
  activityId?: Maybe<Scalars['Int']>;
  /** The reply text */
  text?: Maybe<Scalars['String']>;
  /** The amount of likes the reply has */
  likeCount: Scalars['Int'];
  /** If the currently authenticated user liked the reply */
  isLiked?: Maybe<Scalars['Boolean']>;
  /** The time the reply was created at */
  createdAt: Scalars['Int'];
  /** The user who created reply */
  user?: Maybe<User>;
  /** The users who liked the reply */
  likes?: Maybe<Array<Maybe<User>>>;
};

/** Replay to an activity item */
export type ActivityReplyTextArgs = {
  asHtml?: InputMaybe<Scalars['Boolean']>;
};

/** Notification for when a activity reply is liked */
export type ActivityReplyLikeNotification = {
  __typename?: 'ActivityReplyLikeNotification';
  /** The id of the Notification */
  id: Scalars['Int'];
  /** The id of the user who liked to the activity reply */
  userId: Scalars['Int'];
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The id of the activity where the reply which was liked */
  activityId: Scalars['Int'];
  /** The notification context text */
  context?: Maybe<Scalars['String']>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars['Int']>;
  /** The liked activity */
  activity?: Maybe<ActivityUnion>;
  /** The user who liked the activity reply */
  user?: Maybe<User>;
};

/** Notification for when a user replies to the authenticated users activity */
export type ActivityReplyNotification = {
  __typename?: 'ActivityReplyNotification';
  /** The id of the Notification */
  id: Scalars['Int'];
  /** The id of the user who replied to the activity */
  userId: Scalars['Int'];
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The id of the activity which was replied too */
  activityId: Scalars['Int'];
  /** The notification context text */
  context?: Maybe<Scalars['String']>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars['Int']>;
  /** The liked activity */
  activity?: Maybe<ActivityUnion>;
  /** The user who replied to the activity */
  user?: Maybe<User>;
};

/** Notification for when a user replies to activity the authenticated user has replied to */
export type ActivityReplySubscribedNotification = {
  __typename?: 'ActivityReplySubscribedNotification';
  /** The id of the Notification */
  id: Scalars['Int'];
  /** The id of the user who replied to the activity */
  userId: Scalars['Int'];
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The id of the activity which was replied too */
  activityId: Scalars['Int'];
  /** The notification context text */
  context?: Maybe<Scalars['String']>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars['Int']>;
  /** The liked activity */
  activity?: Maybe<ActivityUnion>;
  /** The user who replied to the activity */
  user?: Maybe<User>;
};

/** Activity sort enums */
export enum ActivitySort {
  Id = 'ID',
  IdDesc = 'ID_DESC',
  Pinned = 'PINNED'
}

/** Activity type enum. */
export enum ActivityType {
  /** A text activity */
  Text = 'TEXT',
  /** A anime list update activity */
  AnimeList = 'ANIME_LIST',
  /** A manga list update activity */
  MangaList = 'MANGA_LIST',
  /** A text message activity sent to another user */
  Message = 'MESSAGE',
  /** Anime & Manga list update, only used in query arguments */
  MediaList = 'MEDIA_LIST'
}

/** Activity union type */
export type ActivityUnion = TextActivity | ListActivity | MessageActivity;

/** Notification for when an episode of anime airs */
export type AiringNotification = {
  __typename?: 'AiringNotification';
  /** The id of the Notification */
  id: Scalars['Int'];
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The id of the aired anime */
  animeId: Scalars['Int'];
  /** The episode number that just aired */
  episode: Scalars['Int'];
  /** The notification context text */
  contexts?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars['Int']>;
  /** The associated media of the airing schedule */
  media?: Maybe<Media>;
};

/** Score & Watcher stats for airing anime by episode and mid-week */
export type AiringProgression = {
  __typename?: 'AiringProgression';
  /** The episode the stats were recorded at. .5 is the mid point between 2 episodes airing dates. */
  episode?: Maybe<Scalars['Float']>;
  /** The average score for the media */
  score?: Maybe<Scalars['Float']>;
  /** The amount of users watching the anime */
  watching?: Maybe<Scalars['Int']>;
};

/** Media Airing Schedule. NOTE: We only aim to guarantee that FUTURE airing data is present and accurate. */
export type AiringSchedule = {
  __typename?: 'AiringSchedule';
  /** The id of the airing schedule item */
  id: Scalars['Int'];
  /** The time the episode airs at */
  airingAt: Scalars['Int'];
  /** Seconds until episode starts airing */
  timeUntilAiring: Scalars['Int'];
  /** The airing episode number */
  episode: Scalars['Int'];
  /** The associate media id of the airing episode */
  mediaId: Scalars['Int'];
  /** The associate media of the airing episode */
  media?: Maybe<Media>;
};

export type AiringScheduleConnection = {
  __typename?: 'AiringScheduleConnection';
  edges?: Maybe<Array<Maybe<AiringScheduleEdge>>>;
  nodes?: Maybe<Array<Maybe<AiringSchedule>>>;
  /** The pagination information */
  pageInfo?: Maybe<PageInfo>;
};

/** AiringSchedule connection edge */
export type AiringScheduleEdge = {
  __typename?: 'AiringScheduleEdge';
  node?: Maybe<AiringSchedule>;
  /** The id of the connection */
  id?: Maybe<Scalars['Int']>;
};

export type AiringScheduleInput = {
  airingAt?: InputMaybe<Scalars['Int']>;
  episode?: InputMaybe<Scalars['Int']>;
  timeUntilAiring?: InputMaybe<Scalars['Int']>;
};

/** Airing schedule sort enums */
export enum AiringSort {
  Id = 'ID',
  IdDesc = 'ID_DESC',
  MediaId = 'MEDIA_ID',
  MediaIdDesc = 'MEDIA_ID_DESC',
  Time = 'TIME',
  TimeDesc = 'TIME_DESC',
  Episode = 'EPISODE',
  EpisodeDesc = 'EPISODE_DESC'
}

export type AniChartHighlightInput = {
  mediaId?: InputMaybe<Scalars['Int']>;
  highlight?: InputMaybe<Scalars['String']>;
};

export type AniChartUser = {
  __typename?: 'AniChartUser';
  user?: Maybe<User>;
  settings?: Maybe<Scalars['Json']>;
  highlights?: Maybe<Scalars['Json']>;
};

/** A character that features in an anime or manga */
export type Character = {
  __typename?: 'Character';
  /** The id of the character */
  id: Scalars['Int'];
  /** The names of the character */
  name?: Maybe<CharacterName>;
  /** Character images */
  image?: Maybe<CharacterImage>;
  /** A general description of the character */
  description?: Maybe<Scalars['String']>;
  /** The character's gender. Usually Male, Female, or Non-binary but can be any string. */
  gender?: Maybe<Scalars['String']>;
  /** The character's birth date */
  dateOfBirth?: Maybe<FuzzyDate>;
  /** The character's age. Note this is a string, not an int, it may contain further text and additional ages. */
  age?: Maybe<Scalars['String']>;
  /** The characters blood type */
  bloodType?: Maybe<Scalars['String']>;
  /** If the character is marked as favourite by the currently authenticated user */
  isFavourite: Scalars['Boolean'];
  /** If the character is blocked from being added to favourites */
  isFavouriteBlocked: Scalars['Boolean'];
  /** The url for the character page on the AniList website */
  siteUrl?: Maybe<Scalars['String']>;
  /** Media that includes the character */
  media?: Maybe<MediaConnection>;
  /** @deprecated No data available */
  updatedAt?: Maybe<Scalars['Int']>;
  /** The amount of user's who have favourited the character */
  favourites?: Maybe<Scalars['Int']>;
  /** Notes for site moderators */
  modNotes?: Maybe<Scalars['String']>;
};

/** A character that features in an anime or manga */
export type CharacterDescriptionArgs = {
  asHtml?: InputMaybe<Scalars['Boolean']>;
};

/** A character that features in an anime or manga */
export type CharacterMediaArgs = {
  sort?: InputMaybe<Array<InputMaybe<MediaSort>>>;
  type?: InputMaybe<MediaType>;
  onList?: InputMaybe<Scalars['Boolean']>;
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
};

export type CharacterConnection = {
  __typename?: 'CharacterConnection';
  edges?: Maybe<Array<Maybe<CharacterEdge>>>;
  nodes?: Maybe<Array<Maybe<Character>>>;
  /** The pagination information */
  pageInfo?: Maybe<PageInfo>;
};

/** Character connection edge */
export type CharacterEdge = {
  __typename?: 'CharacterEdge';
  node?: Maybe<Character>;
  /** The id of the connection */
  id?: Maybe<Scalars['Int']>;
  /** The characters role in the media */
  role?: Maybe<CharacterRole>;
  /** Media specific character name */
  name?: Maybe<Scalars['String']>;
  /** The voice actors of the character */
  voiceActors?: Maybe<Array<Maybe<Staff>>>;
  /** The voice actors of the character with role date */
  voiceActorRoles?: Maybe<Array<Maybe<StaffRoleType>>>;
  /** The media the character is in */
  media?: Maybe<Array<Maybe<Media>>>;
  /** The order the character should be displayed from the users favourites */
  favouriteOrder?: Maybe<Scalars['Int']>;
};

/** Character connection edge */
export type CharacterEdgeVoiceActorsArgs = {
  language?: InputMaybe<StaffLanguage>;
  sort?: InputMaybe<Array<InputMaybe<StaffSort>>>;
};

/** Character connection edge */
export type CharacterEdgeVoiceActorRolesArgs = {
  language?: InputMaybe<StaffLanguage>;
  sort?: InputMaybe<Array<InputMaybe<StaffSort>>>;
};

export type CharacterImage = {
  __typename?: 'CharacterImage';
  /** The character's image of media at its largest size */
  large?: Maybe<Scalars['String']>;
  /** The character's image of media at medium size */
  medium?: Maybe<Scalars['String']>;
};

/** The names of the character */
export type CharacterName = {
  __typename?: 'CharacterName';
  /** The character's given name */
  first?: Maybe<Scalars['String']>;
  /** The character's middle name */
  middle?: Maybe<Scalars['String']>;
  /** The character's surname */
  last?: Maybe<Scalars['String']>;
  /** The character's first and last name */
  full?: Maybe<Scalars['String']>;
  /** The character's full name in their native language */
  native?: Maybe<Scalars['String']>;
  /** Other names the character might be referred to as */
  alternative?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Other names the character might be referred to as but are spoilers */
  alternativeSpoiler?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** The currently authenticated users preferred name language. Default romaji for non-authenticated */
  userPreferred?: Maybe<Scalars['String']>;
};

/** The names of the character */
export type CharacterNameInput = {
  /** The character's given name */
  first?: InputMaybe<Scalars['String']>;
  /** The character's middle name */
  middle?: InputMaybe<Scalars['String']>;
  /** The character's surname */
  last?: InputMaybe<Scalars['String']>;
  /** The character's full name in their native language */
  native?: InputMaybe<Scalars['String']>;
  /** Other names the character might be referred by */
  alternative?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Other names the character might be referred to as but are spoilers */
  alternativeSpoiler?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** The role the character plays in the media */
export enum CharacterRole {
  /** A primary character role in the media */
  MAIN = 'MAIN',
  /** A supporting character role in the media */
  SUPPORTING = 'SUPPORTING',
  /** A background character in the media */
  BACKGROUND = 'BACKGROUND'
}

/** Character sort enums */
export enum CharacterSort {
  Id = 'ID',
  IdDesc = 'ID_DESC',
  Role = 'ROLE',
  RoleDesc = 'ROLE_DESC',
  SearchMatch = 'SEARCH_MATCH',
  Favourites = 'FAVOURITES',
  FavouritesDesc = 'FAVOURITES_DESC',
  /** Order manually decided by moderators */
  Relevance = 'RELEVANCE'
}

/** A submission for a character that features in an anime or manga */
export type CharacterSubmission = {
  __typename?: 'CharacterSubmission';
  /** The id of the submission */
  id: Scalars['Int'];
  /** Character that the submission is referencing */
  character?: Maybe<Character>;
  /** The character submission changes */
  submission?: Maybe<Character>;
  /** Submitter for the submission */
  submitter?: Maybe<User>;
  /** Data Mod assigned to handle the submission */
  assignee?: Maybe<User>;
  /** Status of the submission */
  status?: Maybe<SubmissionStatus>;
  /** Inner details of submission status */
  notes?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  /** Whether the submission is locked */
  locked?: Maybe<Scalars['Boolean']>;
  createdAt?: Maybe<Scalars['Int']>;
};

export type CharacterSubmissionConnection = {
  __typename?: 'CharacterSubmissionConnection';
  edges?: Maybe<Array<Maybe<CharacterSubmissionEdge>>>;
  nodes?: Maybe<Array<Maybe<CharacterSubmission>>>;
  /** The pagination information */
  pageInfo?: Maybe<PageInfo>;
};

/** CharacterSubmission connection edge */
export type CharacterSubmissionEdge = {
  __typename?: 'CharacterSubmissionEdge';
  node?: Maybe<CharacterSubmission>;
  /** The characters role in the media */
  role?: Maybe<CharacterRole>;
  /** The voice actors of the character */
  voiceActors?: Maybe<Array<Maybe<Staff>>>;
  /** The submitted voice actors of the character */
  submittedVoiceActors?: Maybe<Array<Maybe<StaffSubmission>>>;
};

/** Deleted data type */
export type Deleted = {
  __typename?: 'Deleted';
  /** If an item has been successfully deleted */
  deleted?: Maybe<Scalars['Boolean']>;
};

export enum ExternalLinkMediaType {
  Anime = 'ANIME',
  Manga = 'MANGA',
  Staff = 'STAFF'
}

export enum ExternalLinkType {
  Info = 'INFO',
  Streaming = 'STREAMING',
  Social = 'SOCIAL'
}

/** User's favourite anime, manga, characters, staff & studios */
export type Favourites = {
  __typename?: 'Favourites';
  /** Favourite anime */
  anime?: Maybe<MediaConnection>;
  /** Favourite manga */
  manga?: Maybe<MediaConnection>;
  /** Favourite characters */
  characters?: Maybe<CharacterConnection>;
  /** Favourite staff */
  staff?: Maybe<StaffConnection>;
  /** Favourite studios */
  studios?: Maybe<StudioConnection>;
};

/** User's favourite anime, manga, characters, staff & studios */
export type FavouritesAnimeArgs = {
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
};

/** User's favourite anime, manga, characters, staff & studios */
export type FavouritesMangaArgs = {
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
};

/** User's favourite anime, manga, characters, staff & studios */
export type FavouritesCharactersArgs = {
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
};

/** User's favourite anime, manga, characters, staff & studios */
export type FavouritesStaffArgs = {
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
};

/** User's favourite anime, manga, characters, staff & studios */
export type FavouritesStudiosArgs = {
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
};

/** Notification for when the authenticated user is followed by another user */
export type FollowingNotification = {
  __typename?: 'FollowingNotification';
  /** The id of the Notification */
  id: Scalars['Int'];
  /** The id of the user who followed the authenticated user */
  userId: Scalars['Int'];
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The notification context text */
  context?: Maybe<Scalars['String']>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars['Int']>;
  /** The liked activity */
  user?: Maybe<User>;
};

/** User's format statistics */
export type FormatStats = {
  __typename?: 'FormatStats';
  format?: Maybe<MediaFormat>;
  amount?: Maybe<Scalars['Int']>;
};

/** Date object that allows for incomplete date values (fuzzy) */
export type FuzzyDate = {
  __typename?: 'FuzzyDate';
  /** Numeric Year (2017) */
  year?: Maybe<Scalars['Int']>;
  /** Numeric Month (3) */
  month?: Maybe<Scalars['Int']>;
  /** Numeric Day (24) */
  day?: Maybe<Scalars['Int']>;
};

/** Date object that allows for incomplete date values (fuzzy) */
export type FuzzyDateInput = {
  /** Numeric Year (2017) */
  year?: InputMaybe<Scalars['Int']>;
  /** Numeric Month (3) */
  month?: InputMaybe<Scalars['Int']>;
  /** Numeric Day (24) */
  day?: InputMaybe<Scalars['Int']>;
};

/** User's genre statistics */
export type GenreStats = {
  __typename?: 'GenreStats';
  genre?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['Int']>;
  meanScore?: Maybe<Scalars['Int']>;
  /** The amount of time in minutes the genre has been watched by the user */
  timeWatched?: Maybe<Scalars['Int']>;
};

/** Page of data (Used for internal use only) */
export type InternalPage = {
  __typename?: 'InternalPage';
  mediaSubmissions?: Maybe<Array<Maybe<MediaSubmission>>>;
  characterSubmissions?: Maybe<Array<Maybe<CharacterSubmission>>>;
  staffSubmissions?: Maybe<Array<Maybe<StaffSubmission>>>;
  revisionHistory?: Maybe<Array<Maybe<RevisionHistory>>>;
  reports?: Maybe<Array<Maybe<Report>>>;
  modActions?: Maybe<Array<Maybe<ModAction>>>;
  userBlockSearch?: Maybe<Array<Maybe<User>>>;
  /** The pagination information */
  pageInfo?: Maybe<PageInfo>;
  users?: Maybe<Array<Maybe<User>>>;
  media?: Maybe<Array<Maybe<Media>>>;
  characters?: Maybe<Array<Maybe<Character>>>;
  staff?: Maybe<Array<Maybe<Staff>>>;
  studios?: Maybe<Array<Maybe<Studio>>>;
  mediaList?: Maybe<Array<Maybe<MediaList>>>;
  airingSchedules?: Maybe<Array<Maybe<AiringSchedule>>>;
  mediaTrends?: Maybe<Array<Maybe<MediaTrend>>>;
  notifications?: Maybe<Array<Maybe<NotificationUnion>>>;
  followers?: Maybe<Array<Maybe<User>>>;
  following?: Maybe<Array<Maybe<User>>>;
  activities?: Maybe<Array<Maybe<ActivityUnion>>>;
  activityReplies?: Maybe<Array<Maybe<ActivityReply>>>;
  threads?: Maybe<Array<Maybe<Thread>>>;
  threadComments?: Maybe<Array<Maybe<ThreadComment>>>;
  reviews?: Maybe<Array<Maybe<Review>>>;
  recommendations?: Maybe<Array<Maybe<Recommendation>>>;
  likes?: Maybe<Array<Maybe<User>>>;
};

/** Page of data (Used for internal use only) */
export type InternalPageMediaSubmissionsArgs = {
  mediaId?: InputMaybe<Scalars['Int']>;
  submissionId?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['Int']>;
  assigneeId?: InputMaybe<Scalars['Int']>;
  status?: InputMaybe<SubmissionStatus>;
  type?: InputMaybe<MediaType>;
  sort?: InputMaybe<Array<InputMaybe<SubmissionSort>>>;
};

/** Page of data (Used for internal use only) */
export type InternalPageCharacterSubmissionsArgs = {
  characterId?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['Int']>;
  assigneeId?: InputMaybe<Scalars['Int']>;
  status?: InputMaybe<SubmissionStatus>;
  sort?: InputMaybe<Array<InputMaybe<SubmissionSort>>>;
};

/** Page of data (Used for internal use only) */
export type InternalPageStaffSubmissionsArgs = {
  staffId?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['Int']>;
  assigneeId?: InputMaybe<Scalars['Int']>;
  status?: InputMaybe<SubmissionStatus>;
  sort?: InputMaybe<Array<InputMaybe<SubmissionSort>>>;
};

/** Page of data (Used for internal use only) */
export type InternalPageRevisionHistoryArgs = {
  userId?: InputMaybe<Scalars['Int']>;
  mediaId?: InputMaybe<Scalars['Int']>;
  characterId?: InputMaybe<Scalars['Int']>;
  staffId?: InputMaybe<Scalars['Int']>;
  studioId?: InputMaybe<Scalars['Int']>;
};

/** Page of data (Used for internal use only) */
export type InternalPageReportsArgs = {
  reporterId?: InputMaybe<Scalars['Int']>;
  reportedId?: InputMaybe<Scalars['Int']>;
};

/** Page of data (Used for internal use only) */
export type InternalPageModActionsArgs = {
  userId?: InputMaybe<Scalars['Int']>;
  modId?: InputMaybe<Scalars['Int']>;
};

/** Page of data (Used for internal use only) */
export type InternalPageUserBlockSearchArgs = {
  search?: InputMaybe<Scalars['String']>;
};

/** Page of data (Used for internal use only) */
export type InternalPageUsersArgs = {
  id?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  isModerator?: InputMaybe<Scalars['Boolean']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<UserSort>>>;
};

/** Page of data (Used for internal use only) */
export type InternalPageMediaArgs = {
  id?: InputMaybe<Scalars['Int']>;
  idMal?: InputMaybe<Scalars['Int']>;
  startDate?: InputMaybe<Scalars['FuzzyDateInt']>;
  endDate?: InputMaybe<Scalars['FuzzyDateInt']>;
  season?: InputMaybe<MediaSeason>;
  seasonYear?: InputMaybe<Scalars['Int']>;
  type?: InputMaybe<MediaType>;
  format?: InputMaybe<MediaFormat>;
  status?: InputMaybe<MediaStatus>;
  episodes?: InputMaybe<Scalars['Int']>;
  duration?: InputMaybe<Scalars['Int']>;
  chapters?: InputMaybe<Scalars['Int']>;
  volumes?: InputMaybe<Scalars['Int']>;
  isAdult?: InputMaybe<Scalars['Boolean']>;
  genre?: InputMaybe<Scalars['String']>;
  tag?: InputMaybe<Scalars['String']>;
  minimumTagRank?: InputMaybe<Scalars['Int']>;
  tagCategory?: InputMaybe<Scalars['String']>;
  onList?: InputMaybe<Scalars['Boolean']>;
  licensedBy?: InputMaybe<Scalars['String']>;
  licensedById?: InputMaybe<Scalars['Int']>;
  averageScore?: InputMaybe<Scalars['Int']>;
  popularity?: InputMaybe<Scalars['Int']>;
  source?: InputMaybe<MediaSource>;
  countryOfOrigin?: InputMaybe<Scalars['CountryCode']>;
  isLicensed?: InputMaybe<Scalars['Boolean']>;
  search?: InputMaybe<Scalars['String']>;
  id_not?: InputMaybe<Scalars['Int']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  idMal_not?: InputMaybe<Scalars['Int']>;
  idMal_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  idMal_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  startDate_greater?: InputMaybe<Scalars['FuzzyDateInt']>;
  startDate_lesser?: InputMaybe<Scalars['FuzzyDateInt']>;
  startDate_like?: InputMaybe<Scalars['String']>;
  endDate_greater?: InputMaybe<Scalars['FuzzyDateInt']>;
  endDate_lesser?: InputMaybe<Scalars['FuzzyDateInt']>;
  endDate_like?: InputMaybe<Scalars['String']>;
  format_in?: InputMaybe<Array<InputMaybe<MediaFormat>>>;
  format_not?: InputMaybe<MediaFormat>;
  format_not_in?: InputMaybe<Array<InputMaybe<MediaFormat>>>;
  status_in?: InputMaybe<Array<InputMaybe<MediaStatus>>>;
  status_not?: InputMaybe<MediaStatus>;
  status_not_in?: InputMaybe<Array<InputMaybe<MediaStatus>>>;
  episodes_greater?: InputMaybe<Scalars['Int']>;
  episodes_lesser?: InputMaybe<Scalars['Int']>;
  duration_greater?: InputMaybe<Scalars['Int']>;
  duration_lesser?: InputMaybe<Scalars['Int']>;
  chapters_greater?: InputMaybe<Scalars['Int']>;
  chapters_lesser?: InputMaybe<Scalars['Int']>;
  volumes_greater?: InputMaybe<Scalars['Int']>;
  volumes_lesser?: InputMaybe<Scalars['Int']>;
  genre_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  genre_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tag_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tag_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tagCategory_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tagCategory_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  licensedBy_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  licensedById_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  averageScore_not?: InputMaybe<Scalars['Int']>;
  averageScore_greater?: InputMaybe<Scalars['Int']>;
  averageScore_lesser?: InputMaybe<Scalars['Int']>;
  popularity_not?: InputMaybe<Scalars['Int']>;
  popularity_greater?: InputMaybe<Scalars['Int']>;
  popularity_lesser?: InputMaybe<Scalars['Int']>;
  source_in?: InputMaybe<Array<InputMaybe<MediaSource>>>;
  sort?: InputMaybe<Array<InputMaybe<MediaSort>>>;
};

/** Page of data (Used for internal use only) */
export type InternalPageCharactersArgs = {
  id?: InputMaybe<Scalars['Int']>;
  isBirthday?: InputMaybe<Scalars['Boolean']>;
  search?: InputMaybe<Scalars['String']>;
  id_not?: InputMaybe<Scalars['Int']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  sort?: InputMaybe<Array<InputMaybe<CharacterSort>>>;
};

/** Page of data (Used for internal use only) */
export type InternalPageStaffArgs = {
  id?: InputMaybe<Scalars['Int']>;
  isBirthday?: InputMaybe<Scalars['Boolean']>;
  search?: InputMaybe<Scalars['String']>;
  id_not?: InputMaybe<Scalars['Int']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  sort?: InputMaybe<Array<InputMaybe<StaffSort>>>;
};

/** Page of data (Used for internal use only) */
export type InternalPageStudiosArgs = {
  id?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  id_not?: InputMaybe<Scalars['Int']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  sort?: InputMaybe<Array<InputMaybe<StudioSort>>>;
};

/** Page of data (Used for internal use only) */
export type InternalPageMediaListArgs = {
  id?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['Int']>;
  userName?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<MediaType>;
  status?: InputMaybe<MediaListStatus>;
  mediaId?: InputMaybe<Scalars['Int']>;
  isFollowing?: InputMaybe<Scalars['Boolean']>;
  notes?: InputMaybe<Scalars['String']>;
  startedAt?: InputMaybe<Scalars['FuzzyDateInt']>;
  completedAt?: InputMaybe<Scalars['FuzzyDateInt']>;
  compareWithAuthList?: InputMaybe<Scalars['Boolean']>;
  userId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  status_in?: InputMaybe<Array<InputMaybe<MediaListStatus>>>;
  status_not_in?: InputMaybe<Array<InputMaybe<MediaListStatus>>>;
  status_not?: InputMaybe<MediaListStatus>;
  mediaId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  mediaId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  notes_like?: InputMaybe<Scalars['String']>;
  startedAt_greater?: InputMaybe<Scalars['FuzzyDateInt']>;
  startedAt_lesser?: InputMaybe<Scalars['FuzzyDateInt']>;
  startedAt_like?: InputMaybe<Scalars['String']>;
  completedAt_greater?: InputMaybe<Scalars['FuzzyDateInt']>;
  completedAt_lesser?: InputMaybe<Scalars['FuzzyDateInt']>;
  completedAt_like?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<MediaListSort>>>;
};

/** Page of data (Used for internal use only) */
export type InternalPageAiringSchedulesArgs = {
  id?: InputMaybe<Scalars['Int']>;
  mediaId?: InputMaybe<Scalars['Int']>;
  episode?: InputMaybe<Scalars['Int']>;
  airingAt?: InputMaybe<Scalars['Int']>;
  notYetAired?: InputMaybe<Scalars['Boolean']>;
  id_not?: InputMaybe<Scalars['Int']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  mediaId_not?: InputMaybe<Scalars['Int']>;
  mediaId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  mediaId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  episode_not?: InputMaybe<Scalars['Int']>;
  episode_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  episode_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  episode_greater?: InputMaybe<Scalars['Int']>;
  episode_lesser?: InputMaybe<Scalars['Int']>;
  airingAt_greater?: InputMaybe<Scalars['Int']>;
  airingAt_lesser?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<AiringSort>>>;
};

/** Page of data (Used for internal use only) */
export type InternalPageMediaTrendsArgs = {
  mediaId?: InputMaybe<Scalars['Int']>;
  date?: InputMaybe<Scalars['Int']>;
  trending?: InputMaybe<Scalars['Int']>;
  averageScore?: InputMaybe<Scalars['Int']>;
  popularity?: InputMaybe<Scalars['Int']>;
  episode?: InputMaybe<Scalars['Int']>;
  releasing?: InputMaybe<Scalars['Boolean']>;
  mediaId_not?: InputMaybe<Scalars['Int']>;
  mediaId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  mediaId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  date_greater?: InputMaybe<Scalars['Int']>;
  date_lesser?: InputMaybe<Scalars['Int']>;
  trending_greater?: InputMaybe<Scalars['Int']>;
  trending_lesser?: InputMaybe<Scalars['Int']>;
  trending_not?: InputMaybe<Scalars['Int']>;
  averageScore_greater?: InputMaybe<Scalars['Int']>;
  averageScore_lesser?: InputMaybe<Scalars['Int']>;
  averageScore_not?: InputMaybe<Scalars['Int']>;
  popularity_greater?: InputMaybe<Scalars['Int']>;
  popularity_lesser?: InputMaybe<Scalars['Int']>;
  popularity_not?: InputMaybe<Scalars['Int']>;
  episode_greater?: InputMaybe<Scalars['Int']>;
  episode_lesser?: InputMaybe<Scalars['Int']>;
  episode_not?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<MediaTrendSort>>>;
};

/** Page of data (Used for internal use only) */
export type InternalPageNotificationsArgs = {
  type?: InputMaybe<NotificationType>;
  resetNotificationCount?: InputMaybe<Scalars['Boolean']>;
  type_in?: InputMaybe<Array<InputMaybe<NotificationType>>>;
};

/** Page of data (Used for internal use only) */
export type InternalPageFollowersArgs = {
  userId: Scalars['Int'];
  sort?: InputMaybe<Array<InputMaybe<UserSort>>>;
};

/** Page of data (Used for internal use only) */
export type InternalPageFollowingArgs = {
  userId: Scalars['Int'];
  sort?: InputMaybe<Array<InputMaybe<UserSort>>>;
};

/** Page of data (Used for internal use only) */
export type InternalPageActivitiesArgs = {
  id?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['Int']>;
  messengerId?: InputMaybe<Scalars['Int']>;
  mediaId?: InputMaybe<Scalars['Int']>;
  type?: InputMaybe<ActivityType>;
  isFollowing?: InputMaybe<Scalars['Boolean']>;
  hasReplies?: InputMaybe<Scalars['Boolean']>;
  hasRepliesOrTypeText?: InputMaybe<Scalars['Boolean']>;
  createdAt?: InputMaybe<Scalars['Int']>;
  id_not?: InputMaybe<Scalars['Int']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  userId_not?: InputMaybe<Scalars['Int']>;
  userId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  userId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  messengerId_not?: InputMaybe<Scalars['Int']>;
  messengerId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  messengerId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  mediaId_not?: InputMaybe<Scalars['Int']>;
  mediaId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  mediaId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  type_not?: InputMaybe<ActivityType>;
  type_in?: InputMaybe<Array<InputMaybe<ActivityType>>>;
  type_not_in?: InputMaybe<Array<InputMaybe<ActivityType>>>;
  createdAt_greater?: InputMaybe<Scalars['Int']>;
  createdAt_lesser?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<ActivitySort>>>;
};

/** Page of data (Used for internal use only) */
export type InternalPageActivityRepliesArgs = {
  id?: InputMaybe<Scalars['Int']>;
  activityId?: InputMaybe<Scalars['Int']>;
};

/** Page of data (Used for internal use only) */
export type InternalPageThreadsArgs = {
  id?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['Int']>;
  replyUserId?: InputMaybe<Scalars['Int']>;
  subscribed?: InputMaybe<Scalars['Boolean']>;
  categoryId?: InputMaybe<Scalars['Int']>;
  mediaCategoryId?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  sort?: InputMaybe<Array<InputMaybe<ThreadSort>>>;
};

/** Page of data (Used for internal use only) */
export type InternalPageThreadCommentsArgs = {
  id?: InputMaybe<Scalars['Int']>;
  threadId?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<ThreadCommentSort>>>;
};

/** Page of data (Used for internal use only) */
export type InternalPageReviewsArgs = {
  id?: InputMaybe<Scalars['Int']>;
  mediaId?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['Int']>;
  mediaType?: InputMaybe<MediaType>;
  sort?: InputMaybe<Array<InputMaybe<ReviewSort>>>;
};

/** Page of data (Used for internal use only) */
export type InternalPageRecommendationsArgs = {
  id?: InputMaybe<Scalars['Int']>;
  mediaId?: InputMaybe<Scalars['Int']>;
  mediaRecommendationId?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['Int']>;
  rating?: InputMaybe<Scalars['Int']>;
  onList?: InputMaybe<Scalars['Boolean']>;
  rating_greater?: InputMaybe<Scalars['Int']>;
  rating_lesser?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<RecommendationSort>>>;
};

/** Page of data (Used for internal use only) */
export type InternalPageLikesArgs = {
  likeableId?: InputMaybe<Scalars['Int']>;
  type?: InputMaybe<LikeableType>;
};

/** Types that can be liked */
export enum LikeableType {
  Thread = 'THREAD',
  ThreadComment = 'THREAD_COMMENT',
  Activity = 'ACTIVITY',
  ActivityReply = 'ACTIVITY_REPLY'
}

/** Likeable union type */
export type LikeableUnion = ListActivity | TextActivity | MessageActivity | ActivityReply | Thread | ThreadComment;

/** User list activity (anime & manga updates) */
export type ListActivity = {
  __typename?: 'ListActivity';
  /** The id of the activity */
  id: Scalars['Int'];
  /** The user id of the activity's creator */
  userId?: Maybe<Scalars['Int']>;
  /** The type of activity */
  type?: Maybe<ActivityType>;
  /** The number of activity replies */
  replyCount: Scalars['Int'];
  /** The list item's textual status */
  status?: Maybe<Scalars['String']>;
  /** The list progress made */
  progress?: Maybe<Scalars['String']>;
  /** If the activity is locked and can receive replies */
  isLocked?: Maybe<Scalars['Boolean']>;
  /** If the currently authenticated user is subscribed to the activity */
  isSubscribed?: Maybe<Scalars['Boolean']>;
  /** The amount of likes the activity has */
  likeCount: Scalars['Int'];
  /** If the currently authenticated user liked the activity */
  isLiked?: Maybe<Scalars['Boolean']>;
  /** If the activity is pinned to the top of the users activity feed */
  isPinned?: Maybe<Scalars['Boolean']>;
  /** The url for the activity page on the AniList website */
  siteUrl?: Maybe<Scalars['String']>;
  /** The time the activity was created at */
  createdAt: Scalars['Int'];
  /** The owner of the activity */
  user?: Maybe<User>;
  /** The associated media to the activity update */
  media?: Maybe<Media>;
  /** The written replies to the activity */
  replies?: Maybe<Array<Maybe<ActivityReply>>>;
  /** The users who liked the activity */
  likes?: Maybe<Array<Maybe<User>>>;
};

export type ListActivityOption = {
  __typename?: 'ListActivityOption';
  disabled?: Maybe<Scalars['Boolean']>;
  type?: Maybe<MediaListStatus>;
};

export type ListActivityOptionInput = {
  disabled?: InputMaybe<Scalars['Boolean']>;
  type?: InputMaybe<MediaListStatus>;
};

/** User's list score statistics */
export type ListScoreStats = {
  __typename?: 'ListScoreStats';
  meanScore?: Maybe<Scalars['Int']>;
  standardDeviation?: Maybe<Scalars['Int']>;
};

/** Anime or Manga */
export type Media = {
  __typename?: 'Media';
  /** The id of the media */
  id: Scalars['Int'];
  /** The mal id of the media */
  idMal?: Maybe<Scalars['Int']>;
  /** The official titles of the media in various languages */
  title?: Maybe<MediaTitle>;
  /** The type of the media; anime or manga */
  type?: Maybe<MediaType>;
  /** The format the media was released in */
  format?: Maybe<MediaFormat>;
  /** The current releasing status of the media */
  status?: Maybe<MediaStatus>;
  /** Short description of the media's story and characters */
  description?: Maybe<Scalars['String']>;
  /** The first official release date of the media */
  startDate?: Maybe<FuzzyDate>;
  /** The last official release date of the media */
  endDate?: Maybe<FuzzyDate>;
  /** The season the media was initially released in */
  season?: Maybe<MediaSeason>;
  /** The season year the media was initially released in */
  seasonYear?: Maybe<Scalars['Int']>;
  /** The year & season the media was initially released in */
  seasonInt?: Maybe<Scalars['Int']>;
  /** The amount of episodes the anime has when complete */
  episodes?: Maybe<Scalars['Int']>;
  /** The general length of each anime episode in minutes */
  duration?: Maybe<Scalars['Int']>;
  /** The amount of chapters the manga has when complete */
  chapters?: Maybe<Scalars['Int']>;
  /** The amount of volumes the manga has when complete */
  volumes?: Maybe<Scalars['Int']>;
  /** Where the media was created. (ISO 3166-1 alpha-2) */
  countryOfOrigin?: Maybe<Scalars['CountryCode']>;
  /** If the media is officially licensed or a self-published doujin release */
  isLicensed?: Maybe<Scalars['Boolean']>;
  /** Source type the media was adapted from. */
  source?: Maybe<MediaSource>;
  /** Official Twitter hashtags for the media */
  hashtag?: Maybe<Scalars['String']>;
  /** Media trailer or advertisement */
  trailer?: Maybe<MediaTrailer>;
  /** When the media's data was last updated */
  updatedAt?: Maybe<Scalars['Int']>;
  /** The cover images of the media */
  coverImage?: Maybe<MediaCoverImage>;
  /** The banner image of the media */
  bannerImage?: Maybe<Scalars['String']>;
  /** The genres of the media */
  genres?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Alternative titles of the media */
  synonyms?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** A weighted average score of all the user's scores of the media */
  averageScore?: Maybe<Scalars['Int']>;
  /** Mean score of all the user's scores of the media */
  meanScore?: Maybe<Scalars['Int']>;
  /** The number of users with the media on their list */
  popularity?: Maybe<Scalars['Int']>;
  /** Locked media may not be added to lists our favorited. This may be due to the entry pending for deletion or other reasons. */
  isLocked?: Maybe<Scalars['Boolean']>;
  /** The amount of related activity in the past hour */
  trending?: Maybe<Scalars['Int']>;
  /** The amount of user's who have favourited the media */
  favourites?: Maybe<Scalars['Int']>;
  /** List of tags that describes elements and themes of the media */
  tags?: Maybe<Array<Maybe<MediaTag>>>;
  /** Other media in the same or connecting franchise */
  relations?: Maybe<MediaConnection>;
  /** The characters in the media */
  characters?: Maybe<CharacterConnection>;
  /** The staff who produced the media */
  staff?: Maybe<StaffConnection>;
  /** The companies who produced the media */
  studios?: Maybe<StudioConnection>;
  /** If the media is marked as favourite by the current authenticated user */
  isFavourite: Scalars['Boolean'];
  /** If the media is blocked from being added to favourites */
  isFavouriteBlocked: Scalars['Boolean'];
  /** If the media is intended only for 18+ adult audiences */
  isAdult?: Maybe<Scalars['Boolean']>;
  /** The media's next episode airing schedule */
  nextAiringEpisode?: Maybe<AiringSchedule>;
  /** The media's entire airing schedule */
  airingSchedule?: Maybe<AiringScheduleConnection>;
  /** The media's daily trend stats */
  trends?: Maybe<MediaTrendConnection>;
  /** External links to another site related to the media */
  externalLinks?: Maybe<Array<Maybe<MediaExternalLink>>>;
  /** Data and links to legal streaming episodes on external sites */
  streamingEpisodes?: Maybe<Array<Maybe<MediaStreamingEpisode>>>;
  /** The ranking of the media in a particular time span and format compared to other media */
  rankings?: Maybe<Array<Maybe<MediaRank>>>;
  /** The authenticated user's media list entry for the media */
  mediaListEntry?: Maybe<MediaList>;
  /** User reviews of the media */
  reviews?: Maybe<ReviewConnection>;
  /** User recommendations for similar media */
  recommendations?: Maybe<RecommendationConnection>;
  stats?: Maybe<MediaStats>;
  /** The url for the media page on the AniList website */
  siteUrl?: Maybe<Scalars['String']>;
  /** If the media should have forum thread automatically created for it on airing episode release */
  autoCreateForumThread?: Maybe<Scalars['Boolean']>;
  /** If the media is blocked from being recommended to/from */
  isRecommendationBlocked?: Maybe<Scalars['Boolean']>;
  /** If the media is blocked from being reviewed */
  isReviewBlocked?: Maybe<Scalars['Boolean']>;
  /** Notes for site moderators */
  modNotes?: Maybe<Scalars['String']>;
};

/** Anime or Manga */
export type MediaStatusArgs = {
  version?: InputMaybe<Scalars['Int']>;
};

/** Anime or Manga */
export type MediaDescriptionArgs = {
  asHtml?: InputMaybe<Scalars['Boolean']>;
};

/** Anime or Manga */
export type MediaSourceArgs = {
  version?: InputMaybe<Scalars['Int']>;
};

/** Anime or Manga */
export type MediaCharactersArgs = {
  sort?: InputMaybe<Array<InputMaybe<CharacterSort>>>;
  role?: InputMaybe<CharacterRole>;
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
};

/** Anime or Manga */
export type MediaStaffArgs = {
  sort?: InputMaybe<Array<InputMaybe<StaffSort>>>;
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
};

/** Anime or Manga */
export type MediaStudiosArgs = {
  sort?: InputMaybe<Array<InputMaybe<StudioSort>>>;
  isMain?: InputMaybe<Scalars['Boolean']>;
};

/** Anime or Manga */
export type MediaAiringScheduleArgs = {
  notYetAired?: InputMaybe<Scalars['Boolean']>;
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
};

/** Anime or Manga */
export type MediaTrendsArgs = {
  sort?: InputMaybe<Array<InputMaybe<MediaTrendSort>>>;
  releasing?: InputMaybe<Scalars['Boolean']>;
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
};

/** Anime or Manga */
export type MediaReviewsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<ReviewSort>>>;
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
};

/** Anime or Manga */
export type MediaRecommendationsArgs = {
  sort?: InputMaybe<Array<InputMaybe<RecommendationSort>>>;
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
};

/** Internal - Media characters separated */
export type MediaCharacter = {
  __typename?: 'MediaCharacter';
  /** The id of the connection */
  id?: Maybe<Scalars['Int']>;
  /** The characters role in the media */
  role?: Maybe<CharacterRole>;
  roleNotes?: Maybe<Scalars['String']>;
  dubGroup?: Maybe<Scalars['String']>;
  /** Media specific character name */
  characterName?: Maybe<Scalars['String']>;
  /** The characters in the media voiced by the parent actor */
  character?: Maybe<Character>;
  /** The voice actor of the character */
  voiceActor?: Maybe<Staff>;
};

export type MediaConnection = {
  __typename?: 'MediaConnection';
  edges?: Maybe<Array<Maybe<MediaEdge>>>;
  nodes?: Maybe<Array<Maybe<Media>>>;
  /** The pagination information */
  pageInfo?: Maybe<PageInfo>;
};

export type MediaCoverImage = {
  __typename?: 'MediaCoverImage';
  /** The cover image url of the media at its largest size. If this size isn't available, large will be provided instead. */
  extraLarge?: Maybe<Scalars['String']>;
  /** The cover image url of the media at a large size */
  large?: Maybe<Scalars['String']>;
  /** The cover image url of the media at medium size */
  medium?: Maybe<Scalars['String']>;
  /** Average #hex color of cover image */
  color?: Maybe<Scalars['String']>;
};

/** Notification for when a media entry's data was changed in a significant way impacting users' list tracking */
export type MediaDataChangeNotification = {
  __typename?: 'MediaDataChangeNotification';
  /** The id of the Notification */
  id: Scalars['Int'];
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The id of the media that received data changes */
  mediaId: Scalars['Int'];
  /** The reason for the media data change */
  context?: Maybe<Scalars['String']>;
  /** The reason for the media data change */
  reason?: Maybe<Scalars['String']>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars['Int']>;
  /** The media that received data changes */
  media?: Maybe<Media>;
};

/** Notification for when a media tracked in a user's list is deleted from the site */
export type MediaDeletionNotification = {
  __typename?: 'MediaDeletionNotification';
  /** The id of the Notification */
  id: Scalars['Int'];
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The title of the deleted media */
  deletedMediaTitle?: Maybe<Scalars['String']>;
  /** The reason for the media deletion */
  context?: Maybe<Scalars['String']>;
  /** The reason for the media deletion */
  reason?: Maybe<Scalars['String']>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars['Int']>;
};

/** Media connection edge */
export type MediaEdge = {
  __typename?: 'MediaEdge';
  node?: Maybe<Media>;
  /** The id of the connection */
  id?: Maybe<Scalars['Int']>;
  /** The type of relation to the parent model */
  relationType?: Maybe<MediaRelation>;
  /** If the studio is the main animation studio of the media (For Studio->MediaConnection field only) */
  isMainStudio: Scalars['Boolean'];
  /** The characters in the media voiced by the parent actor */
  characters?: Maybe<Array<Maybe<Character>>>;
  /** The characters role in the media */
  characterRole?: Maybe<CharacterRole>;
  /** Media specific character name */
  characterName?: Maybe<Scalars['String']>;
  /** Notes regarding the VA's role for the character */
  roleNotes?: Maybe<Scalars['String']>;
  /** Used for grouping roles where multiple dubs exist for the same language. Either dubbing company name or language variant. */
  dubGroup?: Maybe<Scalars['String']>;
  /** The role of the staff member in the production of the media */
  staffRole?: Maybe<Scalars['String']>;
  /** The voice actors of the character */
  voiceActors?: Maybe<Array<Maybe<Staff>>>;
  /** The voice actors of the character with role date */
  voiceActorRoles?: Maybe<Array<Maybe<StaffRoleType>>>;
  /** The order the media should be displayed from the users favourites */
  favouriteOrder?: Maybe<Scalars['Int']>;
};

/** Media connection edge */
export type MediaEdgeRelationTypeArgs = {
  version?: InputMaybe<Scalars['Int']>;
};

/** Media connection edge */
export type MediaEdgeVoiceActorsArgs = {
  language?: InputMaybe<StaffLanguage>;
  sort?: InputMaybe<Array<InputMaybe<StaffSort>>>;
};

/** Media connection edge */
export type MediaEdgeVoiceActorRolesArgs = {
  language?: InputMaybe<StaffLanguage>;
  sort?: InputMaybe<Array<InputMaybe<StaffSort>>>;
};

/** An external link to another site related to the media or staff member */
export type MediaExternalLink = {
  __typename?: 'MediaExternalLink';
  /** The id of the external link */
  id: Scalars['Int'];
  /** The url of the external link or base url of link source */
  url?: Maybe<Scalars['String']>;
  /** The links website site name */
  site: Scalars['String'];
  /** The links website site id */
  siteId?: Maybe<Scalars['Int']>;
  type?: Maybe<ExternalLinkType>;
  /** Language the site content is in. See Staff language field for values. */
  language?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  /** The icon image url of the site. Not available for all links. Transparent PNG 64x64 */
  icon?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  isDisabled?: Maybe<Scalars['Boolean']>;
};

/** An external link to another site related to the media */
export type MediaExternalLinkInput = {
  /** The id of the external link */
  id: Scalars['Int'];
  /** The url of the external link */
  url: Scalars['String'];
  /** The site location of the external link */
  site: Scalars['String'];
};

/** The format the media was released in */
export enum MediaFormat {
  /** Anime broadcast on television */
  TV = 'TV',
  /** Anime which are under 15 minutes in length and broadcast on television */
  TV_SHORT = 'TV_SHORT',
  /** Anime movies with a theatrical release */
  MOVIE = 'MOVIE',
  /** Special episodes that have been included in DVD/Blu-ray releases, picture dramas, pilots, etc */
  SPECIAL = 'SPECIAL',
  /**
   * (Original Video Animation) Anime that have been released directly on
   * DVD/Blu-ray without originally going through a theatrical release or
   * television broadcast
   */
  OVA = 'OVA',
  /** (Original Net Animation) Anime that have been originally released online or are only available through streaming services. */
  ONA = 'ONA',
  /** Short anime released as a music video */
  MUSIC = 'MUSIC',
  /** Professionally published manga with more than one chapter */
  MANGA = 'MANGA',
  /** Written books released as a series of light novels */
  NOVEL = 'NOVEL',
  /** Manga with just one chapter */
  ONE_SHOT = 'ONE_SHOT'
}

/** List of anime or manga */
export type MediaList = {
  __typename?: 'MediaList';
  /** The id of the list entry */
  id: Scalars['Int'];
  /** The id of the user owner of the list entry */
  userId: Scalars['Int'];
  /** The id of the media */
  mediaId: Scalars['Int'];
  /** The watching/reading status */
  status?: Maybe<MediaListStatus>;
  /** The score of the entry */
  score?: Maybe<Scalars['Float']>;
  /** The amount of episodes/chapters consumed by the user */
  progress?: Maybe<Scalars['Int']>;
  /** The amount of volumes read by the user */
  progressVolumes?: Maybe<Scalars['Int']>;
  /** The amount of times the user has rewatched/read the media */
  repeat?: Maybe<Scalars['Int']>;
  /** Priority of planning */
  priority?: Maybe<Scalars['Int']>;
  /** If the entry should only be visible to authenticated user */
  private?: Maybe<Scalars['Boolean']>;
  /** Text notes */
  notes?: Maybe<Scalars['String']>;
  /** If the entry shown be hidden from non-custom lists */
  hiddenFromStatusLists?: Maybe<Scalars['Boolean']>;
  /** Map of booleans for which custom lists the entry are in */
  customLists?: Maybe<Scalars['Json']>;
  /** Map of advanced scores with name keys */
  advancedScores?: Maybe<Scalars['Json']>;
  /** When the entry was started by the user */
  startedAt?: Maybe<FuzzyDate>;
  /** When the entry was completed by the user */
  completedAt?: Maybe<FuzzyDate>;
  /** When the entry data was last updated */
  updatedAt?: Maybe<Scalars['Int']>;
  /** When the entry data was created */
  createdAt?: Maybe<Scalars['Int']>;
  media?: Maybe<Media>;
  user?: Maybe<User>;
};

/** List of anime or manga */
export type MediaListScoreArgs = {
  format?: InputMaybe<ScoreFormat>;
};

/** List of anime or manga */
export type MediaListCustomListsArgs = {
  asArray?: InputMaybe<Scalars['Boolean']>;
};

/** List of anime or manga */
export type MediaListCollection = {
  __typename?: 'MediaListCollection';
  /** Grouped media list entries */
  lists?: Maybe<Array<Maybe<MediaListGroup>>>;
  /** The owner of the list */
  user?: Maybe<User>;
  /** If there is another chunk */
  hasNextChunk?: Maybe<Scalars['Boolean']>;
  /**
   * A map of media list entry arrays grouped by status
   * @deprecated Not GraphQL spec compliant, use lists field instead.
   */
  statusLists?: Maybe<Array<Maybe<Array<Maybe<MediaList>>>>>;
  /**
   * A map of media list entry arrays grouped by custom lists
   * @deprecated Not GraphQL spec compliant, use lists field instead.
   */
  customLists?: Maybe<Array<Maybe<Array<Maybe<MediaList>>>>>;
};

/** List of anime or manga */
export type MediaListCollectionStatusListsArgs = {
  asArray?: InputMaybe<Scalars['Boolean']>;
};

/** List of anime or manga */
export type MediaListCollectionCustomListsArgs = {
  asArray?: InputMaybe<Scalars['Boolean']>;
};

/** List group of anime or manga entries */
export type MediaListGroup = {
  __typename?: 'MediaListGroup';
  /** Media list entries */
  entries?: Maybe<Array<Maybe<MediaList>>>;
  name?: Maybe<Scalars['String']>;
  isCustomList?: Maybe<Scalars['Boolean']>;
  isSplitCompletedList?: Maybe<Scalars['Boolean']>;
  status?: Maybe<MediaListStatus>;
};

/** A user's list options */
export type MediaListOptions = {
  __typename?: 'MediaListOptions';
  /** The score format the user is using for media lists */
  scoreFormat?: Maybe<ScoreFormat>;
  /** The default order list rows should be displayed in */
  rowOrder?: Maybe<Scalars['String']>;
  /** @deprecated No longer used */
  useLegacyLists?: Maybe<Scalars['Boolean']>;
  /** The user's anime list options */
  animeList?: Maybe<MediaListTypeOptions>;
  /** The user's manga list options */
  mangaList?: Maybe<MediaListTypeOptions>;
  /**
   * The list theme options for both lists
   * @deprecated No longer used
   */
  sharedTheme?: Maybe<Scalars['Json']>;
  /**
   * If the shared theme should be used instead of the individual list themes
   * @deprecated No longer used
   */
  sharedThemeEnabled?: Maybe<Scalars['Boolean']>;
};

/** A user's list options for anime or manga lists */
export type MediaListOptionsInput = {
  /** The order each list should be displayed in */
  sectionOrder?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** If the completed sections of the list should be separated by format */
  splitCompletedSectionByFormat?: InputMaybe<Scalars['Boolean']>;
  /** The names of the user's custom lists */
  customLists?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** The names of the user's advanced scoring sections */
  advancedScoring?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** If advanced scoring is enabled */
  advancedScoringEnabled?: InputMaybe<Scalars['Boolean']>;
  /** list theme */
  theme?: InputMaybe<Scalars['String']>;
};

/** Media list sort enums */
export enum MediaListSort {
  MediaId = 'MEDIA_ID',
  MediaIdDesc = 'MEDIA_ID_DESC',
  Score = 'SCORE',
  ScoreDesc = 'SCORE_DESC',
  Status = 'STATUS',
  StatusDesc = 'STATUS_DESC',
  Progress = 'PROGRESS',
  ProgressDesc = 'PROGRESS_DESC',
  ProgressVolumes = 'PROGRESS_VOLUMES',
  ProgressVolumesDesc = 'PROGRESS_VOLUMES_DESC',
  Repeat = 'REPEAT',
  RepeatDesc = 'REPEAT_DESC',
  Priority = 'PRIORITY',
  PriorityDesc = 'PRIORITY_DESC',
  StartedOn = 'STARTED_ON',
  StartedOnDesc = 'STARTED_ON_DESC',
  FinishedOn = 'FINISHED_ON',
  FinishedOnDesc = 'FINISHED_ON_DESC',
  AddedTime = 'ADDED_TIME',
  AddedTimeDesc = 'ADDED_TIME_DESC',
  UpdatedTime = 'UPDATED_TIME',
  UpdatedTimeDesc = 'UPDATED_TIME_DESC',
  MediaTitleRomaji = 'MEDIA_TITLE_ROMAJI',
  MediaTitleRomajiDesc = 'MEDIA_TITLE_ROMAJI_DESC',
  MediaTitleEnglish = 'MEDIA_TITLE_ENGLISH',
  MediaTitleEnglishDesc = 'MEDIA_TITLE_ENGLISH_DESC',
  MediaTitleNative = 'MEDIA_TITLE_NATIVE',
  MediaTitleNativeDesc = 'MEDIA_TITLE_NATIVE_DESC',
  MediaPopularity = 'MEDIA_POPULARITY',
  MediaPopularityDesc = 'MEDIA_POPULARITY_DESC'
}

/** Media list watching/reading status enum. */
export enum MediaListStatus {
  /** Currently watching/reading */
  CURRENT = 'CURRENT',
  /** Planning to watch/read */
  PLANNING = 'PLANNING',
  /** Finished watching/reading */
  COMPLETED = 'COMPLETED',
  /** Stopped watching/reading before completing */
  DROPPED = 'DROPPED',
  /** Paused watching/reading */
  PAUSED = 'PAUSED',
  /** Re-watching/reading */
  REPEATING = 'REPEATING'
}

/** A user's list options for anime or manga lists */
export type MediaListTypeOptions = {
  __typename?: 'MediaListTypeOptions';
  /** The order each list should be displayed in */
  sectionOrder?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** If the completed sections of the list should be separated by format */
  splitCompletedSectionByFormat?: Maybe<Scalars['Boolean']>;
  /**
   * The list theme options
   * @deprecated This field has not yet been fully implemented and may change without warning
   */
  theme?: Maybe<Scalars['Json']>;
  /** The names of the user's custom lists */
  customLists?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** The names of the user's advanced scoring sections */
  advancedScoring?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** If advanced scoring is enabled */
  advancedScoringEnabled?: Maybe<Scalars['Boolean']>;
};

/** Notification for when a media entry is merged into another for a user who had it on their list */
export type MediaMergeNotification = {
  __typename?: 'MediaMergeNotification';
  /** The id of the Notification */
  id: Scalars['Int'];
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The id of the media that was merged into */
  mediaId: Scalars['Int'];
  /** The title of the deleted media */
  deletedMediaTitles?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** The reason for the media data change */
  context?: Maybe<Scalars['String']>;
  /** The reason for the media merge */
  reason?: Maybe<Scalars['String']>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars['Int']>;
  /** The media that was merged into */
  media?: Maybe<Media>;
};

/** The ranking of a media in a particular time span and format compared to other media */
export type MediaRank = {
  __typename?: 'MediaRank';
  /** The id of the rank */
  id: Scalars['Int'];
  /** The numerical rank of the media */
  rank: Scalars['Int'];
  /** The type of ranking */
  type: MediaRankType;
  /** The format the media is ranked within */
  format: MediaFormat;
  /** The year the media is ranked within */
  year?: Maybe<Scalars['Int']>;
  /** The season the media is ranked within */
  season?: Maybe<MediaSeason>;
  /** If the ranking is based on all time instead of a season/year */
  allTime?: Maybe<Scalars['Boolean']>;
  /** String that gives context to the ranking type and time span */
  context: Scalars['String'];
};

/** The type of ranking */
export enum MediaRankType {
  /** Ranking is based on the media's ratings/score */
  RATED = 'RATED',
  /** Ranking is based on the media's popularity */
  POPULAR = 'POPULAR'
}

/** Type of relation media has to its parent. */
export enum MediaRelation {
  /** An adaption of this media into a different format */
  Adaptation = 'ADAPTATION',
  /** Released before the relation */
  Prequel = 'PREQUEL',
  /** Released after the relation */
  Sequel = 'SEQUEL',
  /** The media a side story is from */
  Parent = 'PARENT',
  /** A side story of the parent media */
  SideStory = 'SIDE_STORY',
  /** Shares at least 1 character */
  Character = 'CHARACTER',
  /** A shortened and summarized version */
  Summary = 'SUMMARY',
  /** An alternative version of the same media */
  Alternative = 'ALTERNATIVE',
  /** An alternative version of the media with a different primary focus */
  SpinOff = 'SPIN_OFF',
  /** Other */
  Other = 'OTHER',
  /** Version 2 only. The source material the media was adapted from */
  Source = 'SOURCE',
  /** Version 2 only. */
  Compilation = 'COMPILATION',
  /** Version 2 only. */
  Contains = 'CONTAINS'
}

export enum MediaSeason {
  /** Months December to February */
  WINTER = 'WINTER',
  /** Months March to May */
  SPRING = 'SPRING',
  /** Months June to August */
  SUMMER = 'SUMMER',
  /** Months September to November */
  FALL = 'FALL'
}

/** Media sort enums */
export enum MediaSort {
  ID = 'ID',
  ID_DESC = 'ID_DESC',
  TITLE_ROMAJI = 'TITLE_ROMAJI',
  TITLE_ROMAJI_DESC = 'TITLE_ROMAJI_DESC',
  TITLE_ENGLISH = 'TITLE_ENGLISH',
  TITLE_ENGLISH_DESC = 'TITLE_ENGLISH_DESC',
  TITLE_NATIVE = 'TITLE_NATIVE',
  TITLE_NATIVE_DESC = 'TITLE_NATIVE_DESC',
  TYPE = 'TYPE',
  TYPE_DESC = 'TYPE_DESC',
  FORMAT = 'FORMAT',
  FORMAT_DESC = 'FORMAT_DESC',
  START_DATE = 'START_DATE',
  START_DATE_DESC = 'START_DATE_DESC',
  END_DATE = 'END_DATE',
  END_DATE_DESC = 'END_DATE_DESC',
  SCORE = 'SCORE',
  SCORE_DESC = 'SCORE_DESC',
  POPULARITY = 'POPULARITY',
  POPULARITY_DESC = 'POPULARITY_DESC',
  TRENDING = 'TRENDING',
  TRENDING_DESC = 'TRENDING_DESC',
  EPISODES = 'EPISODES',
  EPISODES_DESC = 'EPISODES_DESC',
  DURATION = 'DURATION',
  DURATION_DESC = 'DURATION_DESC',
  STATUS = 'STATUS',
  STATUS_DESC = 'STATUS_DESC',
  CHAPTERS = 'CHAPTERS',
  CHAPTERS_DESC = 'CHAPTERS_DESC',
  VOLUMES = 'VOLUMES',
  VOLUMES_DESC = 'VOLUMES_DESC',
  UPDATED_AT = 'UPDATED_AT',
  UPDATED_AT_DESC = 'UPDATED_AT_DESC',
  SEARCH_MATCH = 'SEARCH_MATCH',
  FAVOURITES = 'FAVOURITES',
  FAVOURITES_DESC = 'FAVOURITES_DESC'
}

/** Source type the media was adapted from */
export enum MediaSource {
  /** An original production not based of another work */
  Original = 'ORIGINAL',
  /** Asian comic book */
  Manga = 'MANGA',
  /** Written work published in volumes */
  LightNovel = 'LIGHT_NOVEL',
  /** Video game driven primary by text and narrative */
  VisualNovel = 'VISUAL_NOVEL',
  /** Video game */
  VideoGame = 'VIDEO_GAME',
  /** Other */
  Other = 'OTHER',
  /** Version 2+ only. Written works not published in volumes */
  Novel = 'NOVEL',
  /** Version 2+ only. Self-published works */
  Doujinshi = 'DOUJINSHI',
  /** Version 2+ only. Japanese Anime */
  Anime = 'ANIME',
  /** Version 3 only. Written works published online */
  WebNovel = 'WEB_NOVEL',
  /** Version 3 only. Live action media such as movies or TV show */
  LiveAction = 'LIVE_ACTION',
  /** Version 3 only. Games excluding video games */
  Game = 'GAME',
  /** Version 3 only. Comics excluding manga */
  Comic = 'COMIC',
  /** Version 3 only. Multimedia project */
  MultimediaProject = 'MULTIMEDIA_PROJECT',
  /** Version 3 only. Picture book */
  PictureBook = 'PICTURE_BOOK'
}

/** A media's statistics */
export type MediaStats = {
  __typename?: 'MediaStats';
  scoreDistribution?: Maybe<Array<Maybe<ScoreDistribution>>>;
  statusDistribution?: Maybe<Array<Maybe<StatusDistribution>>>;
  /** @deprecated Replaced by MediaTrends */
  airingProgression?: Maybe<Array<Maybe<AiringProgression>>>;
};

/** The current releasing status of the media */
export enum MediaStatus {
  /** Has completed and is no longer being released */
  Finished = 'FINISHED',
  /** Currently releasing */
  Releasing = 'RELEASING',
  /** To be released at a later date */
  NotYetReleased = 'NOT_YET_RELEASED',
  /** Ended before the work could be finished */
  Cancelled = 'CANCELLED',
  /** Version 2 only. Is currently paused from releasing and will resume at a later date */
  Hiatus = 'HIATUS'
}

/** Data and links to legal streaming episodes on external sites */
export type MediaStreamingEpisode = {
  __typename?: 'MediaStreamingEpisode';
  /** Title of the episode */
  title?: Maybe<Scalars['String']>;
  /** Url of episode image thumbnail */
  thumbnail?: Maybe<Scalars['String']>;
  /** The url of the episode */
  url?: Maybe<Scalars['String']>;
  /** The site location of the streaming episodes */
  site?: Maybe<Scalars['String']>;
};

/** Media submission */
export type MediaSubmission = {
  __typename?: 'MediaSubmission';
  /** The id of the submission */
  id: Scalars['Int'];
  /** User submitter of the submission */
  submitter?: Maybe<User>;
  /** Data Mod assigned to handle the submission */
  assignee?: Maybe<User>;
  /** Status of the submission */
  status?: Maybe<SubmissionStatus>;
  submitterStats?: Maybe<Scalars['Json']>;
  notes?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  changes?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Whether the submission is locked */
  locked?: Maybe<Scalars['Boolean']>;
  media?: Maybe<Media>;
  submission?: Maybe<Media>;
  characters?: Maybe<Array<Maybe<MediaSubmissionComparison>>>;
  staff?: Maybe<Array<Maybe<MediaSubmissionComparison>>>;
  studios?: Maybe<Array<Maybe<MediaSubmissionComparison>>>;
  relations?: Maybe<Array<Maybe<MediaEdge>>>;
  externalLinks?: Maybe<Array<Maybe<MediaSubmissionComparison>>>;
  createdAt?: Maybe<Scalars['Int']>;
};

/** Media submission with comparison to current data */
export type MediaSubmissionComparison = {
  __typename?: 'MediaSubmissionComparison';
  submission?: Maybe<MediaSubmissionEdge>;
  character?: Maybe<MediaCharacter>;
  staff?: Maybe<StaffEdge>;
  studio?: Maybe<StudioEdge>;
  externalLink?: Maybe<MediaExternalLink>;
};

export type MediaSubmissionEdge = {
  __typename?: 'MediaSubmissionEdge';
  /** The id of the direct submission */
  id?: Maybe<Scalars['Int']>;
  characterRole?: Maybe<CharacterRole>;
  staffRole?: Maybe<Scalars['String']>;
  roleNotes?: Maybe<Scalars['String']>;
  dubGroup?: Maybe<Scalars['String']>;
  characterName?: Maybe<Scalars['String']>;
  isMain?: Maybe<Scalars['Boolean']>;
  character?: Maybe<Character>;
  characterSubmission?: Maybe<Character>;
  voiceActor?: Maybe<Staff>;
  voiceActorSubmission?: Maybe<Staff>;
  staff?: Maybe<Staff>;
  staffSubmission?: Maybe<Staff>;
  studio?: Maybe<Studio>;
  externalLink?: Maybe<MediaExternalLink>;
  media?: Maybe<Media>;
};

/** A tag that describes a theme or element of the media */
export type MediaTag = {
  __typename?: 'MediaTag';
  /** The id of the tag */
  id: Scalars['Int'];
  /** The name of the tag */
  name: Scalars['String'];
  /** A general description of the tag */
  description?: Maybe<Scalars['String']>;
  /** The categories of tags this tag belongs to */
  category?: Maybe<Scalars['String']>;
  /** The relevance ranking of the tag out of the 100 for this media */
  rank?: Maybe<Scalars['Int']>;
  /** If the tag could be a spoiler for any media */
  isGeneralSpoiler?: Maybe<Scalars['Boolean']>;
  /** If the tag is a spoiler for this media */
  isMediaSpoiler?: Maybe<Scalars['Boolean']>;
  /** If the tag is only for adult 18+ media */
  isAdult?: Maybe<Scalars['Boolean']>;
  /** The user who submitted the tag */
  userId?: Maybe<Scalars['Int']>;
};

/** The official titles of the media in various languages */
export type MediaTitle = {
  __typename?: 'MediaTitle';
  /** The romanization of the native language title */
  romaji?: Maybe<Scalars['String']>;
  /** The official english title */
  english?: Maybe<Scalars['String']>;
  /** Official title in it's native language */
  native?: Maybe<Scalars['String']>;
  /** The currently authenticated users preferred title language. Default romaji for non-authenticated */
  userPreferred?: Maybe<Scalars['String']>;
};

/** The official titles of the media in various languages */
export type MediaTitleRomajiArgs = {
  stylised?: InputMaybe<Scalars['Boolean']>;
};

/** The official titles of the media in various languages */
export type MediaTitleEnglishArgs = {
  stylised?: InputMaybe<Scalars['Boolean']>;
};

/** The official titles of the media in various languages */
export type MediaTitleNativeArgs = {
  stylised?: InputMaybe<Scalars['Boolean']>;
};

/** The official titles of the media in various languages */
export type MediaTitleInput = {
  /** The romanization of the native language title */
  romaji?: InputMaybe<Scalars['String']>;
  /** The official english title */
  english?: InputMaybe<Scalars['String']>;
  /** Official title in it's native language */
  native?: InputMaybe<Scalars['String']>;
};

/** Media trailer or advertisement */
export type MediaTrailer = {
  __typename?: 'MediaTrailer';
  /** The trailer video id */
  id?: Maybe<Scalars['String']>;
  /** The site the video is hosted by (Currently either youtube or dailymotion) */
  site?: Maybe<Scalars['String']>;
  /** The url for the thumbnail image of the video */
  thumbnail?: Maybe<Scalars['String']>;
};

/** Daily media statistics */
export type MediaTrend = {
  __typename?: 'MediaTrend';
  /** The id of the tag */
  mediaId: Scalars['Int'];
  /** The day the data was recorded (timestamp) */
  date: Scalars['Int'];
  /** The amount of media activity on the day */
  trending: Scalars['Int'];
  /** A weighted average score of all the user's scores of the media */
  averageScore?: Maybe<Scalars['Int']>;
  /** The number of users with the media on their list */
  popularity?: Maybe<Scalars['Int']>;
  /** The number of users with watching/reading the media */
  inProgress?: Maybe<Scalars['Int']>;
  /** If the media was being released at this time */
  releasing: Scalars['Boolean'];
  /** The episode number of the anime released on this day */
  episode?: Maybe<Scalars['Int']>;
  /** The related media */
  media?: Maybe<Media>;
};

export type MediaTrendConnection = {
  __typename?: 'MediaTrendConnection';
  edges?: Maybe<Array<Maybe<MediaTrendEdge>>>;
  nodes?: Maybe<Array<Maybe<MediaTrend>>>;
  /** The pagination information */
  pageInfo?: Maybe<PageInfo>;
};

/** Media trend connection edge */
export type MediaTrendEdge = {
  __typename?: 'MediaTrendEdge';
  node?: Maybe<MediaTrend>;
};

/** Media trend sort enums */
export enum MediaTrendSort {
  Id = 'ID',
  IdDesc = 'ID_DESC',
  MediaId = 'MEDIA_ID',
  MediaIdDesc = 'MEDIA_ID_DESC',
  Date = 'DATE',
  DateDesc = 'DATE_DESC',
  Score = 'SCORE',
  ScoreDesc = 'SCORE_DESC',
  Popularity = 'POPULARITY',
  PopularityDesc = 'POPULARITY_DESC',
  Trending = 'TRENDING',
  TrendingDesc = 'TRENDING_DESC',
  Episode = 'EPISODE',
  EpisodeDesc = 'EPISODE_DESC'
}

/** Media type enum, anime or manga. */
export enum MediaType {
  /** Japanese Anime */
  ANIME = 'ANIME',
  /** Asian comic */
  MANGA = 'MANGA'
}

/** User message activity */
export type MessageActivity = {
  __typename?: 'MessageActivity';
  /** The id of the activity */
  id: Scalars['Int'];
  /** The user id of the activity's recipient */
  recipientId?: Maybe<Scalars['Int']>;
  /** The user id of the activity's sender */
  messengerId?: Maybe<Scalars['Int']>;
  /** The type of the activity */
  type?: Maybe<ActivityType>;
  /** The number of activity replies */
  replyCount: Scalars['Int'];
  /** The message text (Markdown) */
  message?: Maybe<Scalars['String']>;
  /** If the activity is locked and can receive replies */
  isLocked?: Maybe<Scalars['Boolean']>;
  /** If the currently authenticated user is subscribed to the activity */
  isSubscribed?: Maybe<Scalars['Boolean']>;
  /** The amount of likes the activity has */
  likeCount: Scalars['Int'];
  /** If the currently authenticated user liked the activity */
  isLiked?: Maybe<Scalars['Boolean']>;
  /** If the message is private and only viewable to the sender and recipients */
  isPrivate?: Maybe<Scalars['Boolean']>;
  /** The url for the activity page on the AniList website */
  siteUrl?: Maybe<Scalars['String']>;
  /** The time the activity was created at */
  createdAt: Scalars['Int'];
  /** The user who the activity message was sent to */
  recipient?: Maybe<User>;
  /** The user who sent the activity message */
  messenger?: Maybe<User>;
  /** The written replies to the activity */
  replies?: Maybe<Array<Maybe<ActivityReply>>>;
  /** The users who liked the activity */
  likes?: Maybe<Array<Maybe<User>>>;
};

/** User message activity */
export type MessageActivityMessageArgs = {
  asHtml?: InputMaybe<Scalars['Boolean']>;
};

export type ModAction = {
  __typename?: 'ModAction';
  /** The id of the action */
  id: Scalars['Int'];
  user?: Maybe<User>;
  mod?: Maybe<User>;
  type?: Maybe<ModActionType>;
  objectId?: Maybe<Scalars['Int']>;
  objectType?: Maybe<Scalars['String']>;
  data?: Maybe<Scalars['String']>;
  createdAt: Scalars['Int'];
};

export enum ModActionType {
  Note = 'NOTE',
  Ban = 'BAN',
  Delete = 'DELETE',
  Edit = 'EDIT',
  Expire = 'EXPIRE',
  Report = 'REPORT',
  Reset = 'RESET',
  Anon = 'ANON'
}

/** Mod role enums */
export enum ModRole {
  /** An AniList administrator */
  Admin = 'ADMIN',
  /** A head developer of AniList */
  LeadDeveloper = 'LEAD_DEVELOPER',
  /** An AniList developer */
  Developer = 'DEVELOPER',
  /** A lead community moderator */
  LeadCommunity = 'LEAD_COMMUNITY',
  /** A community moderator */
  Community = 'COMMUNITY',
  /** A discord community moderator */
  DiscordCommunity = 'DISCORD_COMMUNITY',
  /** A lead anime data moderator */
  LeadAnimeData = 'LEAD_ANIME_DATA',
  /** An anime data moderator */
  AnimeData = 'ANIME_DATA',
  /** A lead manga data moderator */
  LeadMangaData = 'LEAD_MANGA_DATA',
  /** A manga data moderator */
  MangaData = 'MANGA_DATA',
  /** A lead social media moderator */
  LeadSocialMedia = 'LEAD_SOCIAL_MEDIA',
  /** A social media moderator */
  SocialMedia = 'SOCIAL_MEDIA',
  /** A retired moderator */
  Retired = 'RETIRED'
}

export type Mutation = {
  __typename?: 'Mutation';
  UpdateUser?: Maybe<User>;
  /** Create or update a media list entry */
  SaveMediaListEntry?: Maybe<MediaList>;
  /** Update multiple media list entries to the same values */
  UpdateMediaListEntries?: Maybe<Array<Maybe<MediaList>>>;
  /** Delete a media list entry */
  DeleteMediaListEntry?: Maybe<Deleted>;
  /** Delete a custom list and remove the list entries from it */
  DeleteCustomList?: Maybe<Deleted>;
  /** Create or update text activity for the currently authenticated user */
  SaveTextActivity?: Maybe<TextActivity>;
  /** Create or update message activity for the currently authenticated user */
  SaveMessageActivity?: Maybe<MessageActivity>;
  /** Update list activity (Mod Only) */
  SaveListActivity?: Maybe<ListActivity>;
  /** Delete an activity item of the authenticated users */
  DeleteActivity?: Maybe<Deleted>;
  /** Toggle activity to be pinned to the top of the user's activity feed */
  ToggleActivityPin?: Maybe<ActivityUnion>;
  /** Toggle the subscription of an activity item */
  ToggleActivitySubscription?: Maybe<ActivityUnion>;
  /** Create or update an activity reply */
  SaveActivityReply?: Maybe<ActivityReply>;
  /** Delete an activity reply of the authenticated users */
  DeleteActivityReply?: Maybe<Deleted>;
  /**
   * Add or remove a like from a likeable type.
   *                           Returns all the users who liked the same model
   */
  ToggleLike?: Maybe<Array<Maybe<User>>>;
  /** Add or remove a like from a likeable type. */
  ToggleLikeV2?: Maybe<LikeableUnion>;
  /** Toggle the un/following of a user */
  ToggleFollow?: Maybe<User>;
  /** Favourite or unfavourite an anime, manga, character, staff member, or studio */
  ToggleFavourite?: Maybe<Favourites>;
  /** Update the order favourites are displayed in */
  UpdateFavouriteOrder?: Maybe<Favourites>;
  /** Create or update a review */
  SaveReview?: Maybe<Review>;
  /** Delete a review */
  DeleteReview?: Maybe<Deleted>;
  /** Rate a review */
  RateReview?: Maybe<Review>;
  /** Recommendation a media */
  SaveRecommendation?: Maybe<Recommendation>;
  /** Create or update a forum thread */
  SaveThread?: Maybe<Thread>;
  /** Delete a thread */
  DeleteThread?: Maybe<Deleted>;
  /** Toggle the subscription of a forum thread */
  ToggleThreadSubscription?: Maybe<Thread>;
  /** Create or update a thread comment */
  SaveThreadComment?: Maybe<ThreadComment>;
  /** Delete a thread comment */
  DeleteThreadComment?: Maybe<Deleted>;
  UpdateAniChartSettings?: Maybe<Scalars['Json']>;
  UpdateAniChartHighlights?: Maybe<Scalars['Json']>;
};

export type MutationUpdateUserArgs = {
  about?: InputMaybe<Scalars['String']>;
  titleLanguage?: InputMaybe<UserTitleLanguage>;
  displayAdultContent?: InputMaybe<Scalars['Boolean']>;
  airingNotifications?: InputMaybe<Scalars['Boolean']>;
  scoreFormat?: InputMaybe<ScoreFormat>;
  rowOrder?: InputMaybe<Scalars['String']>;
  profileColor?: InputMaybe<Scalars['String']>;
  donatorBadge?: InputMaybe<Scalars['String']>;
  notificationOptions?: InputMaybe<Array<InputMaybe<NotificationOptionInput>>>;
  timezone?: InputMaybe<Scalars['String']>;
  activityMergeTime?: InputMaybe<Scalars['Int']>;
  animeListOptions?: InputMaybe<MediaListOptionsInput>;
  mangaListOptions?: InputMaybe<MediaListOptionsInput>;
  staffNameLanguage?: InputMaybe<UserStaffNameLanguage>;
  restrictMessagesToFollowing?: InputMaybe<Scalars['Boolean']>;
  disabledListActivity?: InputMaybe<Array<InputMaybe<ListActivityOptionInput>>>;
};

export type MutationSaveMediaListEntryArgs = {
  id?: InputMaybe<Scalars['Int']>;
  mediaId?: InputMaybe<Scalars['Int']>;
  status?: InputMaybe<MediaListStatus>;
  score?: InputMaybe<Scalars['Float']>;
  scoreRaw?: InputMaybe<Scalars['Int']>;
  progress?: InputMaybe<Scalars['Int']>;
  progressVolumes?: InputMaybe<Scalars['Int']>;
  repeat?: InputMaybe<Scalars['Int']>;
  priority?: InputMaybe<Scalars['Int']>;
  private?: InputMaybe<Scalars['Boolean']>;
  notes?: InputMaybe<Scalars['String']>;
  hiddenFromStatusLists?: InputMaybe<Scalars['Boolean']>;
  customLists?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  advancedScores?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  startedAt?: InputMaybe<FuzzyDateInput>;
  completedAt?: InputMaybe<FuzzyDateInput>;
};

export type MutationUpdateMediaListEntriesArgs = {
  status?: InputMaybe<MediaListStatus>;
  score?: InputMaybe<Scalars['Float']>;
  scoreRaw?: InputMaybe<Scalars['Int']>;
  progress?: InputMaybe<Scalars['Int']>;
  progressVolumes?: InputMaybe<Scalars['Int']>;
  repeat?: InputMaybe<Scalars['Int']>;
  priority?: InputMaybe<Scalars['Int']>;
  private?: InputMaybe<Scalars['Boolean']>;
  notes?: InputMaybe<Scalars['String']>;
  hiddenFromStatusLists?: InputMaybe<Scalars['Boolean']>;
  advancedScores?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  startedAt?: InputMaybe<FuzzyDateInput>;
  completedAt?: InputMaybe<FuzzyDateInput>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type MutationDeleteMediaListEntryArgs = {
  id?: InputMaybe<Scalars['Int']>;
};

export type MutationDeleteCustomListArgs = {
  customList?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<MediaType>;
};

export type MutationSaveTextActivityArgs = {
  id?: InputMaybe<Scalars['Int']>;
  text?: InputMaybe<Scalars['String']>;
  locked?: InputMaybe<Scalars['Boolean']>;
};

export type MutationSaveMessageActivityArgs = {
  id?: InputMaybe<Scalars['Int']>;
  message?: InputMaybe<Scalars['String']>;
  recipientId?: InputMaybe<Scalars['Int']>;
  private?: InputMaybe<Scalars['Boolean']>;
  locked?: InputMaybe<Scalars['Boolean']>;
  asMod?: InputMaybe<Scalars['Boolean']>;
};

export type MutationSaveListActivityArgs = {
  id?: InputMaybe<Scalars['Int']>;
  locked?: InputMaybe<Scalars['Boolean']>;
};

export type MutationDeleteActivityArgs = {
  id?: InputMaybe<Scalars['Int']>;
};

export type MutationToggleActivityPinArgs = {
  id?: InputMaybe<Scalars['Int']>;
  pinned?: InputMaybe<Scalars['Boolean']>;
};

export type MutationToggleActivitySubscriptionArgs = {
  activityId?: InputMaybe<Scalars['Int']>;
  subscribe?: InputMaybe<Scalars['Boolean']>;
};

export type MutationSaveActivityReplyArgs = {
  id?: InputMaybe<Scalars['Int']>;
  activityId?: InputMaybe<Scalars['Int']>;
  text?: InputMaybe<Scalars['String']>;
  asMod?: InputMaybe<Scalars['Boolean']>;
};

export type MutationDeleteActivityReplyArgs = {
  id?: InputMaybe<Scalars['Int']>;
};

export type MutationToggleLikeArgs = {
  id?: InputMaybe<Scalars['Int']>;
  type?: InputMaybe<LikeableType>;
};

export type MutationToggleLikeV2Args = {
  id?: InputMaybe<Scalars['Int']>;
  type?: InputMaybe<LikeableType>;
};

export type MutationToggleFollowArgs = {
  userId?: InputMaybe<Scalars['Int']>;
};

export type MutationToggleFavouriteArgs = {
  animeId?: InputMaybe<Scalars['Int']>;
  mangaId?: InputMaybe<Scalars['Int']>;
  characterId?: InputMaybe<Scalars['Int']>;
  staffId?: InputMaybe<Scalars['Int']>;
  studioId?: InputMaybe<Scalars['Int']>;
};

export type MutationUpdateFavouriteOrderArgs = {
  animeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  mangaIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  characterIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  staffIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  studioIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  animeOrder?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  mangaOrder?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  characterOrder?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  staffOrder?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  studioOrder?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type MutationSaveReviewArgs = {
  id?: InputMaybe<Scalars['Int']>;
  mediaId?: InputMaybe<Scalars['Int']>;
  body?: InputMaybe<Scalars['String']>;
  summary?: InputMaybe<Scalars['String']>;
  score?: InputMaybe<Scalars['Int']>;
  private?: InputMaybe<Scalars['Boolean']>;
};

export type MutationDeleteReviewArgs = {
  id?: InputMaybe<Scalars['Int']>;
};

export type MutationRateReviewArgs = {
  reviewId?: InputMaybe<Scalars['Int']>;
  rating?: InputMaybe<ReviewRating>;
};

export type MutationSaveRecommendationArgs = {
  mediaId?: InputMaybe<Scalars['Int']>;
  mediaRecommendationId?: InputMaybe<Scalars['Int']>;
  rating?: InputMaybe<RecommendationRating>;
};

export type MutationSaveThreadArgs = {
  id?: InputMaybe<Scalars['Int']>;
  title?: InputMaybe<Scalars['String']>;
  body?: InputMaybe<Scalars['String']>;
  categories?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  mediaCategories?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  sticky?: InputMaybe<Scalars['Boolean']>;
  locked?: InputMaybe<Scalars['Boolean']>;
};

export type MutationDeleteThreadArgs = {
  id?: InputMaybe<Scalars['Int']>;
};

export type MutationToggleThreadSubscriptionArgs = {
  threadId?: InputMaybe<Scalars['Int']>;
  subscribe?: InputMaybe<Scalars['Boolean']>;
};

export type MutationSaveThreadCommentArgs = {
  id?: InputMaybe<Scalars['Int']>;
  threadId?: InputMaybe<Scalars['Int']>;
  parentCommentId?: InputMaybe<Scalars['Int']>;
  comment?: InputMaybe<Scalars['String']>;
  locked?: InputMaybe<Scalars['Boolean']>;
};

export type MutationDeleteThreadCommentArgs = {
  id?: InputMaybe<Scalars['Int']>;
};

export type MutationUpdateAniChartSettingsArgs = {
  titleLanguage?: InputMaybe<Scalars['String']>;
  outgoingLinkProvider?: InputMaybe<Scalars['String']>;
  theme?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateAniChartHighlightsArgs = {
  highlights?: InputMaybe<Array<InputMaybe<AniChartHighlightInput>>>;
};

/** Notification option */
export type NotificationOption = {
  __typename?: 'NotificationOption';
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** Whether this type of notification is enabled */
  enabled?: Maybe<Scalars['Boolean']>;
};

/** Notification option input */
export type NotificationOptionInput = {
  /** The type of notification */
  type?: InputMaybe<NotificationType>;
  /** Whether this type of notification is enabled */
  enabled?: InputMaybe<Scalars['Boolean']>;
};

/** Notification type enum */
export enum NotificationType {
  /** A user has sent you message */
  ActivityMessage = 'ACTIVITY_MESSAGE',
  /** A user has replied to your activity */
  ActivityReply = 'ACTIVITY_REPLY',
  /** A user has followed you */
  Following = 'FOLLOWING',
  /** A user has mentioned you in their activity */
  ActivityMention = 'ACTIVITY_MENTION',
  /** A user has mentioned you in a forum comment */
  ThreadCommentMention = 'THREAD_COMMENT_MENTION',
  /** A user has commented in one of your subscribed forum threads */
  ThreadSubscribed = 'THREAD_SUBSCRIBED',
  /** A user has replied to your forum comment */
  ThreadCommentReply = 'THREAD_COMMENT_REPLY',
  /** An anime you are currently watching has aired */
  Airing = 'AIRING',
  /** A user has liked your activity */
  ActivityLike = 'ACTIVITY_LIKE',
  /** A user has liked your activity reply */
  ActivityReplyLike = 'ACTIVITY_REPLY_LIKE',
  /** A user has liked your forum thread */
  ThreadLike = 'THREAD_LIKE',
  /** A user has liked your forum comment */
  ThreadCommentLike = 'THREAD_COMMENT_LIKE',
  /** A user has replied to activity you have also replied to */
  ActivityReplySubscribed = 'ACTIVITY_REPLY_SUBSCRIBED',
  /** A new anime or manga has been added to the site where its related media is on the user's list */
  RelatedMediaAddition = 'RELATED_MEDIA_ADDITION',
  /** An anime or manga has had a data change that affects how a user may track it in their lists */
  MediaDataChange = 'MEDIA_DATA_CHANGE',
  /** Anime or manga entries on the user's list have been merged into a single entry */
  MediaMerge = 'MEDIA_MERGE',
  /** An anime or manga on the user's list has been deleted from the site */
  MediaDeletion = 'MEDIA_DELETION'
}

/** Notification union type */
export type NotificationUnion =
  | AiringNotification
  | FollowingNotification
  | ActivityMessageNotification
  | ActivityMentionNotification
  | ActivityReplyNotification
  | ActivityReplySubscribedNotification
  | ActivityLikeNotification
  | ActivityReplyLikeNotification
  | ThreadCommentMentionNotification
  | ThreadCommentReplyNotification
  | ThreadCommentSubscribedNotification
  | ThreadCommentLikeNotification
  | ThreadLikeNotification
  | RelatedMediaAdditionNotification
  | MediaDataChangeNotification
  | MediaMergeNotification
  | MediaDeletionNotification;

/** Page of data */
export type Page = {
  __typename?: 'Page';
  /** The pagination information */
  pageInfo?: Maybe<PageInfo>;
  users?: Maybe<Array<Maybe<User>>>;
  media?: Maybe<Array<Maybe<Media>>>;
  characters?: Maybe<Array<Maybe<Character>>>;
  staff?: Maybe<Array<Maybe<Staff>>>;
  studios?: Maybe<Array<Maybe<Studio>>>;
  mediaList?: Maybe<Array<Maybe<MediaList>>>;
  airingSchedules?: Maybe<Array<Maybe<AiringSchedule>>>;
  mediaTrends?: Maybe<Array<Maybe<MediaTrend>>>;
  notifications?: Maybe<Array<Maybe<NotificationUnion>>>;
  followers?: Maybe<Array<Maybe<User>>>;
  following?: Maybe<Array<Maybe<User>>>;
  activities?: Maybe<Array<Maybe<ActivityUnion>>>;
  activityReplies?: Maybe<Array<Maybe<ActivityReply>>>;
  threads?: Maybe<Array<Maybe<Thread>>>;
  threadComments?: Maybe<Array<Maybe<ThreadComment>>>;
  reviews?: Maybe<Array<Maybe<Review>>>;
  recommendations?: Maybe<Array<Maybe<Recommendation>>>;
  likes?: Maybe<Array<Maybe<User>>>;
};

/** Page of data */
export type PageUsersArgs = {
  id?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  isModerator?: InputMaybe<Scalars['Boolean']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<UserSort>>>;
};

/** Page of data */
export type PageMediaArgs = {
  id?: InputMaybe<Scalars['Int']>;
  idMal?: InputMaybe<Scalars['Int']>;
  startDate?: InputMaybe<Scalars['FuzzyDateInt']>;
  endDate?: InputMaybe<Scalars['FuzzyDateInt']>;
  season?: InputMaybe<MediaSeason>;
  seasonYear?: InputMaybe<Scalars['Int']>;
  type?: InputMaybe<MediaType>;
  format?: InputMaybe<MediaFormat>;
  status?: InputMaybe<MediaStatus>;
  episodes?: InputMaybe<Scalars['Int']>;
  duration?: InputMaybe<Scalars['Int']>;
  chapters?: InputMaybe<Scalars['Int']>;
  volumes?: InputMaybe<Scalars['Int']>;
  isAdult?: InputMaybe<Scalars['Boolean']>;
  genre?: InputMaybe<Scalars['String']>;
  tag?: InputMaybe<Scalars['String']>;
  minimumTagRank?: InputMaybe<Scalars['Int']>;
  tagCategory?: InputMaybe<Scalars['String']>;
  onList?: InputMaybe<Scalars['Boolean']>;
  licensedBy?: InputMaybe<Scalars['String']>;
  licensedById?: InputMaybe<Scalars['Int']>;
  averageScore?: InputMaybe<Scalars['Int']>;
  popularity?: InputMaybe<Scalars['Int']>;
  source?: InputMaybe<MediaSource>;
  countryOfOrigin?: InputMaybe<Scalars['CountryCode']>;
  isLicensed?: InputMaybe<Scalars['Boolean']>;
  search?: InputMaybe<Scalars['String']>;
  id_not?: InputMaybe<Scalars['Int']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  idMal_not?: InputMaybe<Scalars['Int']>;
  idMal_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  idMal_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  startDate_greater?: InputMaybe<Scalars['FuzzyDateInt']>;
  startDate_lesser?: InputMaybe<Scalars['FuzzyDateInt']>;
  startDate_like?: InputMaybe<Scalars['String']>;
  endDate_greater?: InputMaybe<Scalars['FuzzyDateInt']>;
  endDate_lesser?: InputMaybe<Scalars['FuzzyDateInt']>;
  endDate_like?: InputMaybe<Scalars['String']>;
  format_in?: InputMaybe<Array<InputMaybe<MediaFormat>>>;
  format_not?: InputMaybe<MediaFormat>;
  format_not_in?: InputMaybe<Array<InputMaybe<MediaFormat>>>;
  status_in?: InputMaybe<Array<InputMaybe<MediaStatus>>>;
  status_not?: InputMaybe<MediaStatus>;
  status_not_in?: InputMaybe<Array<InputMaybe<MediaStatus>>>;
  episodes_greater?: InputMaybe<Scalars['Int']>;
  episodes_lesser?: InputMaybe<Scalars['Int']>;
  duration_greater?: InputMaybe<Scalars['Int']>;
  duration_lesser?: InputMaybe<Scalars['Int']>;
  chapters_greater?: InputMaybe<Scalars['Int']>;
  chapters_lesser?: InputMaybe<Scalars['Int']>;
  volumes_greater?: InputMaybe<Scalars['Int']>;
  volumes_lesser?: InputMaybe<Scalars['Int']>;
  genre_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  genre_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tag_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tag_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tagCategory_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tagCategory_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  licensedBy_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  licensedById_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  averageScore_not?: InputMaybe<Scalars['Int']>;
  averageScore_greater?: InputMaybe<Scalars['Int']>;
  averageScore_lesser?: InputMaybe<Scalars['Int']>;
  popularity_not?: InputMaybe<Scalars['Int']>;
  popularity_greater?: InputMaybe<Scalars['Int']>;
  popularity_lesser?: InputMaybe<Scalars['Int']>;
  source_in?: InputMaybe<Array<InputMaybe<MediaSource>>>;
  sort?: InputMaybe<Array<InputMaybe<MediaSort>>>;
};

/** Page of data */
export type PageCharactersArgs = {
  id?: InputMaybe<Scalars['Int']>;
  isBirthday?: InputMaybe<Scalars['Boolean']>;
  search?: InputMaybe<Scalars['String']>;
  id_not?: InputMaybe<Scalars['Int']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  sort?: InputMaybe<Array<InputMaybe<CharacterSort>>>;
};

/** Page of data */
export type PageStaffArgs = {
  id?: InputMaybe<Scalars['Int']>;
  isBirthday?: InputMaybe<Scalars['Boolean']>;
  search?: InputMaybe<Scalars['String']>;
  id_not?: InputMaybe<Scalars['Int']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  sort?: InputMaybe<Array<InputMaybe<StaffSort>>>;
};

/** Page of data */
export type PageStudiosArgs = {
  id?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  id_not?: InputMaybe<Scalars['Int']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  sort?: InputMaybe<Array<InputMaybe<StudioSort>>>;
};

/** Page of data */
export type PageMediaListArgs = {
  id?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['Int']>;
  userName?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<MediaType>;
  status?: InputMaybe<MediaListStatus>;
  mediaId?: InputMaybe<Scalars['Int']>;
  isFollowing?: InputMaybe<Scalars['Boolean']>;
  notes?: InputMaybe<Scalars['String']>;
  startedAt?: InputMaybe<Scalars['FuzzyDateInt']>;
  completedAt?: InputMaybe<Scalars['FuzzyDateInt']>;
  compareWithAuthList?: InputMaybe<Scalars['Boolean']>;
  userId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  status_in?: InputMaybe<Array<InputMaybe<MediaListStatus>>>;
  status_not_in?: InputMaybe<Array<InputMaybe<MediaListStatus>>>;
  status_not?: InputMaybe<MediaListStatus>;
  mediaId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  mediaId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  notes_like?: InputMaybe<Scalars['String']>;
  startedAt_greater?: InputMaybe<Scalars['FuzzyDateInt']>;
  startedAt_lesser?: InputMaybe<Scalars['FuzzyDateInt']>;
  startedAt_like?: InputMaybe<Scalars['String']>;
  completedAt_greater?: InputMaybe<Scalars['FuzzyDateInt']>;
  completedAt_lesser?: InputMaybe<Scalars['FuzzyDateInt']>;
  completedAt_like?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<MediaListSort>>>;
};

/** Page of data */
export type PageAiringSchedulesArgs = {
  id?: InputMaybe<Scalars['Int']>;
  mediaId?: InputMaybe<Scalars['Int']>;
  episode?: InputMaybe<Scalars['Int']>;
  airingAt?: InputMaybe<Scalars['Int']>;
  notYetAired?: InputMaybe<Scalars['Boolean']>;
  id_not?: InputMaybe<Scalars['Int']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  mediaId_not?: InputMaybe<Scalars['Int']>;
  mediaId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  mediaId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  episode_not?: InputMaybe<Scalars['Int']>;
  episode_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  episode_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  episode_greater?: InputMaybe<Scalars['Int']>;
  episode_lesser?: InputMaybe<Scalars['Int']>;
  airingAt_greater?: InputMaybe<Scalars['Int']>;
  airingAt_lesser?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<AiringSort>>>;
};

/** Page of data */
export type PageMediaTrendsArgs = {
  mediaId?: InputMaybe<Scalars['Int']>;
  date?: InputMaybe<Scalars['Int']>;
  trending?: InputMaybe<Scalars['Int']>;
  averageScore?: InputMaybe<Scalars['Int']>;
  popularity?: InputMaybe<Scalars['Int']>;
  episode?: InputMaybe<Scalars['Int']>;
  releasing?: InputMaybe<Scalars['Boolean']>;
  mediaId_not?: InputMaybe<Scalars['Int']>;
  mediaId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  mediaId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  date_greater?: InputMaybe<Scalars['Int']>;
  date_lesser?: InputMaybe<Scalars['Int']>;
  trending_greater?: InputMaybe<Scalars['Int']>;
  trending_lesser?: InputMaybe<Scalars['Int']>;
  trending_not?: InputMaybe<Scalars['Int']>;
  averageScore_greater?: InputMaybe<Scalars['Int']>;
  averageScore_lesser?: InputMaybe<Scalars['Int']>;
  averageScore_not?: InputMaybe<Scalars['Int']>;
  popularity_greater?: InputMaybe<Scalars['Int']>;
  popularity_lesser?: InputMaybe<Scalars['Int']>;
  popularity_not?: InputMaybe<Scalars['Int']>;
  episode_greater?: InputMaybe<Scalars['Int']>;
  episode_lesser?: InputMaybe<Scalars['Int']>;
  episode_not?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<MediaTrendSort>>>;
};

/** Page of data */
export type PageNotificationsArgs = {
  type?: InputMaybe<NotificationType>;
  resetNotificationCount?: InputMaybe<Scalars['Boolean']>;
  type_in?: InputMaybe<Array<InputMaybe<NotificationType>>>;
};

/** Page of data */
export type PageFollowersArgs = {
  userId: Scalars['Int'];
  sort?: InputMaybe<Array<InputMaybe<UserSort>>>;
};

/** Page of data */
export type PageFollowingArgs = {
  userId: Scalars['Int'];
  sort?: InputMaybe<Array<InputMaybe<UserSort>>>;
};

/** Page of data */
export type PageActivitiesArgs = {
  id?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['Int']>;
  messengerId?: InputMaybe<Scalars['Int']>;
  mediaId?: InputMaybe<Scalars['Int']>;
  type?: InputMaybe<ActivityType>;
  isFollowing?: InputMaybe<Scalars['Boolean']>;
  hasReplies?: InputMaybe<Scalars['Boolean']>;
  hasRepliesOrTypeText?: InputMaybe<Scalars['Boolean']>;
  createdAt?: InputMaybe<Scalars['Int']>;
  id_not?: InputMaybe<Scalars['Int']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  userId_not?: InputMaybe<Scalars['Int']>;
  userId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  userId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  messengerId_not?: InputMaybe<Scalars['Int']>;
  messengerId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  messengerId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  mediaId_not?: InputMaybe<Scalars['Int']>;
  mediaId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  mediaId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  type_not?: InputMaybe<ActivityType>;
  type_in?: InputMaybe<Array<InputMaybe<ActivityType>>>;
  type_not_in?: InputMaybe<Array<InputMaybe<ActivityType>>>;
  createdAt_greater?: InputMaybe<Scalars['Int']>;
  createdAt_lesser?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<ActivitySort>>>;
};

/** Page of data */
export type PageActivityRepliesArgs = {
  id?: InputMaybe<Scalars['Int']>;
  activityId?: InputMaybe<Scalars['Int']>;
};

/** Page of data */
export type PageThreadsArgs = {
  id?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['Int']>;
  replyUserId?: InputMaybe<Scalars['Int']>;
  subscribed?: InputMaybe<Scalars['Boolean']>;
  categoryId?: InputMaybe<Scalars['Int']>;
  mediaCategoryId?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  sort?: InputMaybe<Array<InputMaybe<ThreadSort>>>;
};

/** Page of data */
export type PageThreadCommentsArgs = {
  id?: InputMaybe<Scalars['Int']>;
  threadId?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<ThreadCommentSort>>>;
};

/** Page of data */
export type PageReviewsArgs = {
  id?: InputMaybe<Scalars['Int']>;
  mediaId?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['Int']>;
  mediaType?: InputMaybe<MediaType>;
  sort?: InputMaybe<Array<InputMaybe<ReviewSort>>>;
};

/** Page of data */
export type PageRecommendationsArgs = {
  id?: InputMaybe<Scalars['Int']>;
  mediaId?: InputMaybe<Scalars['Int']>;
  mediaRecommendationId?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['Int']>;
  rating?: InputMaybe<Scalars['Int']>;
  onList?: InputMaybe<Scalars['Boolean']>;
  rating_greater?: InputMaybe<Scalars['Int']>;
  rating_lesser?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<RecommendationSort>>>;
};

/** Page of data */
export type PageLikesArgs = {
  likeableId?: InputMaybe<Scalars['Int']>;
  type?: InputMaybe<LikeableType>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  /** The total number of items. Note: This value is not guaranteed to be accurate, do not rely on this for logic */
  total?: Maybe<Scalars['Int']>;
  /** The count on a page */
  perPage?: Maybe<Scalars['Int']>;
  /** The current page */
  currentPage?: Maybe<Scalars['Int']>;
  /** The last page */
  lastPage?: Maybe<Scalars['Int']>;
  /** If there is another page */
  hasNextPage?: Maybe<Scalars['Boolean']>;
};

/** Provides the parsed markdown as html */
export type ParsedMarkdown = {
  __typename?: 'ParsedMarkdown';
  /** The parsed markdown as html */
  html?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  Page?: Maybe<Page>;
  /** Media query */
  Media?: Maybe<Media>;
  /** Media Trend query */
  MediaTrend?: Maybe<MediaTrend>;
  /** Airing schedule query */
  AiringSchedule?: Maybe<AiringSchedule>;
  /** Character query */
  Character?: Maybe<Character>;
  /** Staff query */
  Staff?: Maybe<Staff>;
  /** Media list query */
  MediaList?: Maybe<MediaList>;
  /**
   * Media list collection query, provides list pre-grouped by status & custom
   * lists. User ID and Media Type arguments required.
   */
  MediaListCollection?: Maybe<MediaListCollection>;
  /** Collection of all the possible media genres */
  GenreCollection?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Collection of all the possible media tags */
  MediaTagCollection?: Maybe<Array<Maybe<MediaTag>>>;
  /** User query */
  User?: Maybe<User>;
  /** Get the currently authenticated user */
  Viewer?: Maybe<User>;
  /** Notification query */
  Notification?: Maybe<NotificationUnion>;
  /** Studio query */
  Studio?: Maybe<Studio>;
  /** Review query */
  Review?: Maybe<Review>;
  /** Activity query */
  Activity?: Maybe<ActivityUnion>;
  /** Activity reply query */
  ActivityReply?: Maybe<ActivityReply>;
  /** Follow query */
  Following?: Maybe<User>;
  /** Follow query */
  Follower?: Maybe<User>;
  /** Thread query */
  Thread?: Maybe<Thread>;
  /** Comment query */
  ThreadComment?: Maybe<Array<Maybe<ThreadComment>>>;
  /** Recommendation query */
  Recommendation?: Maybe<Recommendation>;
  /** Like query */
  Like?: Maybe<User>;
  /** Provide AniList markdown to be converted to html (Requires auth) */
  Markdown?: Maybe<ParsedMarkdown>;
  AniChartUser?: Maybe<AniChartUser>;
  /** Site statistics query */
  SiteStatistics?: Maybe<SiteStatistics>;
  /** ExternalLinkSource collection query */
  ExternalLinkSourceCollection?: Maybe<Array<Maybe<MediaExternalLink>>>;
};

export type QueryPageArgs = {
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
};

export type QueryMediaArgs = {
  id?: InputMaybe<Scalars['Int']>;
  idMal?: InputMaybe<Scalars['Int']>;
  startDate?: InputMaybe<Scalars['FuzzyDateInt']>;
  endDate?: InputMaybe<Scalars['FuzzyDateInt']>;
  season?: InputMaybe<MediaSeason>;
  seasonYear?: InputMaybe<Scalars['Int']>;
  type?: InputMaybe<MediaType>;
  format?: InputMaybe<MediaFormat>;
  status?: InputMaybe<MediaStatus>;
  episodes?: InputMaybe<Scalars['Int']>;
  duration?: InputMaybe<Scalars['Int']>;
  chapters?: InputMaybe<Scalars['Int']>;
  volumes?: InputMaybe<Scalars['Int']>;
  isAdult?: InputMaybe<Scalars['Boolean']>;
  genre?: InputMaybe<Scalars['String']>;
  tag?: InputMaybe<Scalars['String']>;
  minimumTagRank?: InputMaybe<Scalars['Int']>;
  tagCategory?: InputMaybe<Scalars['String']>;
  onList?: InputMaybe<Scalars['Boolean']>;
  licensedBy?: InputMaybe<Scalars['String']>;
  licensedById?: InputMaybe<Scalars['Int']>;
  averageScore?: InputMaybe<Scalars['Int']>;
  popularity?: InputMaybe<Scalars['Int']>;
  source?: InputMaybe<MediaSource>;
  countryOfOrigin?: InputMaybe<Scalars['CountryCode']>;
  isLicensed?: InputMaybe<Scalars['Boolean']>;
  search?: InputMaybe<Scalars['String']>;
  id_not?: InputMaybe<Scalars['Int']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  idMal_not?: InputMaybe<Scalars['Int']>;
  idMal_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  idMal_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  startDate_greater?: InputMaybe<Scalars['FuzzyDateInt']>;
  startDate_lesser?: InputMaybe<Scalars['FuzzyDateInt']>;
  startDate_like?: InputMaybe<Scalars['String']>;
  endDate_greater?: InputMaybe<Scalars['FuzzyDateInt']>;
  endDate_lesser?: InputMaybe<Scalars['FuzzyDateInt']>;
  endDate_like?: InputMaybe<Scalars['String']>;
  format_in?: InputMaybe<Array<InputMaybe<MediaFormat>>>;
  format_not?: InputMaybe<MediaFormat>;
  format_not_in?: InputMaybe<Array<InputMaybe<MediaFormat>>>;
  status_in?: InputMaybe<Array<InputMaybe<MediaStatus>>>;
  status_not?: InputMaybe<MediaStatus>;
  status_not_in?: InputMaybe<Array<InputMaybe<MediaStatus>>>;
  episodes_greater?: InputMaybe<Scalars['Int']>;
  episodes_lesser?: InputMaybe<Scalars['Int']>;
  duration_greater?: InputMaybe<Scalars['Int']>;
  duration_lesser?: InputMaybe<Scalars['Int']>;
  chapters_greater?: InputMaybe<Scalars['Int']>;
  chapters_lesser?: InputMaybe<Scalars['Int']>;
  volumes_greater?: InputMaybe<Scalars['Int']>;
  volumes_lesser?: InputMaybe<Scalars['Int']>;
  genre_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  genre_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tag_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tag_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tagCategory_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tagCategory_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  licensedBy_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  licensedById_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  averageScore_not?: InputMaybe<Scalars['Int']>;
  averageScore_greater?: InputMaybe<Scalars['Int']>;
  averageScore_lesser?: InputMaybe<Scalars['Int']>;
  popularity_not?: InputMaybe<Scalars['Int']>;
  popularity_greater?: InputMaybe<Scalars['Int']>;
  popularity_lesser?: InputMaybe<Scalars['Int']>;
  source_in?: InputMaybe<Array<InputMaybe<MediaSource>>>;
  sort?: InputMaybe<Array<InputMaybe<MediaSort>>>;
};

export type QueryMediaTrendArgs = {
  mediaId?: InputMaybe<Scalars['Int']>;
  date?: InputMaybe<Scalars['Int']>;
  trending?: InputMaybe<Scalars['Int']>;
  averageScore?: InputMaybe<Scalars['Int']>;
  popularity?: InputMaybe<Scalars['Int']>;
  episode?: InputMaybe<Scalars['Int']>;
  releasing?: InputMaybe<Scalars['Boolean']>;
  mediaId_not?: InputMaybe<Scalars['Int']>;
  mediaId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  mediaId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  date_greater?: InputMaybe<Scalars['Int']>;
  date_lesser?: InputMaybe<Scalars['Int']>;
  trending_greater?: InputMaybe<Scalars['Int']>;
  trending_lesser?: InputMaybe<Scalars['Int']>;
  trending_not?: InputMaybe<Scalars['Int']>;
  averageScore_greater?: InputMaybe<Scalars['Int']>;
  averageScore_lesser?: InputMaybe<Scalars['Int']>;
  averageScore_not?: InputMaybe<Scalars['Int']>;
  popularity_greater?: InputMaybe<Scalars['Int']>;
  popularity_lesser?: InputMaybe<Scalars['Int']>;
  popularity_not?: InputMaybe<Scalars['Int']>;
  episode_greater?: InputMaybe<Scalars['Int']>;
  episode_lesser?: InputMaybe<Scalars['Int']>;
  episode_not?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<MediaTrendSort>>>;
};

export type QueryAiringScheduleArgs = {
  id?: InputMaybe<Scalars['Int']>;
  mediaId?: InputMaybe<Scalars['Int']>;
  episode?: InputMaybe<Scalars['Int']>;
  airingAt?: InputMaybe<Scalars['Int']>;
  notYetAired?: InputMaybe<Scalars['Boolean']>;
  id_not?: InputMaybe<Scalars['Int']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  mediaId_not?: InputMaybe<Scalars['Int']>;
  mediaId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  mediaId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  episode_not?: InputMaybe<Scalars['Int']>;
  episode_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  episode_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  episode_greater?: InputMaybe<Scalars['Int']>;
  episode_lesser?: InputMaybe<Scalars['Int']>;
  airingAt_greater?: InputMaybe<Scalars['Int']>;
  airingAt_lesser?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<AiringSort>>>;
};

export type QueryCharacterArgs = {
  id?: InputMaybe<Scalars['Int']>;
  isBirthday?: InputMaybe<Scalars['Boolean']>;
  search?: InputMaybe<Scalars['String']>;
  id_not?: InputMaybe<Scalars['Int']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  sort?: InputMaybe<Array<InputMaybe<CharacterSort>>>;
};

export type QueryStaffArgs = {
  id?: InputMaybe<Scalars['Int']>;
  isBirthday?: InputMaybe<Scalars['Boolean']>;
  search?: InputMaybe<Scalars['String']>;
  id_not?: InputMaybe<Scalars['Int']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  sort?: InputMaybe<Array<InputMaybe<StaffSort>>>;
};

export type QueryMediaListArgs = {
  id?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['Int']>;
  userName?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<MediaType>;
  status?: InputMaybe<MediaListStatus>;
  mediaId?: InputMaybe<Scalars['Int']>;
  isFollowing?: InputMaybe<Scalars['Boolean']>;
  notes?: InputMaybe<Scalars['String']>;
  startedAt?: InputMaybe<Scalars['FuzzyDateInt']>;
  completedAt?: InputMaybe<Scalars['FuzzyDateInt']>;
  compareWithAuthList?: InputMaybe<Scalars['Boolean']>;
  userId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  status_in?: InputMaybe<Array<InputMaybe<MediaListStatus>>>;
  status_not_in?: InputMaybe<Array<InputMaybe<MediaListStatus>>>;
  status_not?: InputMaybe<MediaListStatus>;
  mediaId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  mediaId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  notes_like?: InputMaybe<Scalars['String']>;
  startedAt_greater?: InputMaybe<Scalars['FuzzyDateInt']>;
  startedAt_lesser?: InputMaybe<Scalars['FuzzyDateInt']>;
  startedAt_like?: InputMaybe<Scalars['String']>;
  completedAt_greater?: InputMaybe<Scalars['FuzzyDateInt']>;
  completedAt_lesser?: InputMaybe<Scalars['FuzzyDateInt']>;
  completedAt_like?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<MediaListSort>>>;
};

export type QueryMediaListCollectionArgs = {
  userId?: InputMaybe<Scalars['Int']>;
  userName?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<MediaType>;
  status?: InputMaybe<MediaListStatus>;
  notes?: InputMaybe<Scalars['String']>;
  startedAt?: InputMaybe<Scalars['FuzzyDateInt']>;
  completedAt?: InputMaybe<Scalars['FuzzyDateInt']>;
  forceSingleCompletedList?: InputMaybe<Scalars['Boolean']>;
  chunk?: InputMaybe<Scalars['Int']>;
  perChunk?: InputMaybe<Scalars['Int']>;
  status_in?: InputMaybe<Array<InputMaybe<MediaListStatus>>>;
  status_not_in?: InputMaybe<Array<InputMaybe<MediaListStatus>>>;
  status_not?: InputMaybe<MediaListStatus>;
  notes_like?: InputMaybe<Scalars['String']>;
  startedAt_greater?: InputMaybe<Scalars['FuzzyDateInt']>;
  startedAt_lesser?: InputMaybe<Scalars['FuzzyDateInt']>;
  startedAt_like?: InputMaybe<Scalars['String']>;
  completedAt_greater?: InputMaybe<Scalars['FuzzyDateInt']>;
  completedAt_lesser?: InputMaybe<Scalars['FuzzyDateInt']>;
  completedAt_like?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<MediaListSort>>>;
};

export type QueryMediaTagCollectionArgs = {
  status?: InputMaybe<Scalars['Int']>;
};

export type QueryUserArgs = {
  id?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  isModerator?: InputMaybe<Scalars['Boolean']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<UserSort>>>;
};

export type QueryNotificationArgs = {
  type?: InputMaybe<NotificationType>;
  resetNotificationCount?: InputMaybe<Scalars['Boolean']>;
  type_in?: InputMaybe<Array<InputMaybe<NotificationType>>>;
};

export type QueryStudioArgs = {
  id?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  id_not?: InputMaybe<Scalars['Int']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  sort?: InputMaybe<Array<InputMaybe<StudioSort>>>;
};

export type QueryReviewArgs = {
  id?: InputMaybe<Scalars['Int']>;
  mediaId?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['Int']>;
  mediaType?: InputMaybe<MediaType>;
  sort?: InputMaybe<Array<InputMaybe<ReviewSort>>>;
};

export type QueryActivityArgs = {
  id?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['Int']>;
  messengerId?: InputMaybe<Scalars['Int']>;
  mediaId?: InputMaybe<Scalars['Int']>;
  type?: InputMaybe<ActivityType>;
  isFollowing?: InputMaybe<Scalars['Boolean']>;
  hasReplies?: InputMaybe<Scalars['Boolean']>;
  hasRepliesOrTypeText?: InputMaybe<Scalars['Boolean']>;
  createdAt?: InputMaybe<Scalars['Int']>;
  id_not?: InputMaybe<Scalars['Int']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  userId_not?: InputMaybe<Scalars['Int']>;
  userId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  userId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  messengerId_not?: InputMaybe<Scalars['Int']>;
  messengerId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  messengerId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  mediaId_not?: InputMaybe<Scalars['Int']>;
  mediaId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  mediaId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  type_not?: InputMaybe<ActivityType>;
  type_in?: InputMaybe<Array<InputMaybe<ActivityType>>>;
  type_not_in?: InputMaybe<Array<InputMaybe<ActivityType>>>;
  createdAt_greater?: InputMaybe<Scalars['Int']>;
  createdAt_lesser?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<ActivitySort>>>;
};

export type QueryActivityReplyArgs = {
  id?: InputMaybe<Scalars['Int']>;
  activityId?: InputMaybe<Scalars['Int']>;
};

export type QueryFollowingArgs = {
  userId: Scalars['Int'];
  sort?: InputMaybe<Array<InputMaybe<UserSort>>>;
};

export type QueryFollowerArgs = {
  userId: Scalars['Int'];
  sort?: InputMaybe<Array<InputMaybe<UserSort>>>;
};

export type QueryThreadArgs = {
  id?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['Int']>;
  replyUserId?: InputMaybe<Scalars['Int']>;
  subscribed?: InputMaybe<Scalars['Boolean']>;
  categoryId?: InputMaybe<Scalars['Int']>;
  mediaCategoryId?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  sort?: InputMaybe<Array<InputMaybe<ThreadSort>>>;
};

export type QueryThreadCommentArgs = {
  id?: InputMaybe<Scalars['Int']>;
  threadId?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<ThreadCommentSort>>>;
};

export type QueryRecommendationArgs = {
  id?: InputMaybe<Scalars['Int']>;
  mediaId?: InputMaybe<Scalars['Int']>;
  mediaRecommendationId?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['Int']>;
  rating?: InputMaybe<Scalars['Int']>;
  onList?: InputMaybe<Scalars['Boolean']>;
  rating_greater?: InputMaybe<Scalars['Int']>;
  rating_lesser?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<RecommendationSort>>>;
};

export type QueryLikeArgs = {
  likeableId?: InputMaybe<Scalars['Int']>;
  type?: InputMaybe<LikeableType>;
};

export type QueryMarkdownArgs = {
  markdown: Scalars['String'];
};

export type QueryExternalLinkSourceCollectionArgs = {
  id?: InputMaybe<Scalars['Int']>;
  type?: InputMaybe<ExternalLinkType>;
  mediaType?: InputMaybe<ExternalLinkMediaType>;
};

/** Media recommendation */
export type Recommendation = {
  __typename?: 'Recommendation';
  /** The id of the recommendation */
  id: Scalars['Int'];
  /** Users rating of the recommendation */
  rating?: Maybe<Scalars['Int']>;
  /** The rating of the recommendation by currently authenticated user */
  userRating?: Maybe<RecommendationRating>;
  /** The media the recommendation is from */
  media?: Maybe<Media>;
  /** The recommended media */
  mediaRecommendation?: Maybe<Media>;
  /** The user that first created the recommendation */
  user?: Maybe<User>;
};

export type RecommendationConnection = {
  __typename?: 'RecommendationConnection';
  edges?: Maybe<Array<Maybe<RecommendationEdge>>>;
  nodes?: Maybe<Array<Maybe<Recommendation>>>;
  /** The pagination information */
  pageInfo?: Maybe<PageInfo>;
};

/** Recommendation connection edge */
export type RecommendationEdge = {
  __typename?: 'RecommendationEdge';
  node?: Maybe<Recommendation>;
};

/** Recommendation rating enums */
export enum RecommendationRating {
  NoRating = 'NO_RATING',
  RateUp = 'RATE_UP',
  RateDown = 'RATE_DOWN'
}

/** Recommendation sort enums */
export enum RecommendationSort {
  Id = 'ID',
  IdDesc = 'ID_DESC',
  Rating = 'RATING',
  RatingDesc = 'RATING_DESC'
}

/** Notification for when new media is added to the site */
export type RelatedMediaAdditionNotification = {
  __typename?: 'RelatedMediaAdditionNotification';
  /** The id of the Notification */
  id: Scalars['Int'];
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The id of the new media */
  mediaId: Scalars['Int'];
  /** The notification context text */
  context?: Maybe<Scalars['String']>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars['Int']>;
  /** The associated media of the airing schedule */
  media?: Maybe<Media>;
};

export type Report = {
  __typename?: 'Report';
  id: Scalars['Int'];
  reporter?: Maybe<User>;
  reported?: Maybe<User>;
  reason?: Maybe<Scalars['String']>;
  /** When the entry data was created */
  createdAt?: Maybe<Scalars['Int']>;
  cleared?: Maybe<Scalars['Boolean']>;
};

/** A Review that features in an anime or manga */
export type Review = {
  __typename?: 'Review';
  /** The id of the review */
  id: Scalars['Int'];
  /** The id of the review's creator */
  userId: Scalars['Int'];
  /** The id of the review's media */
  mediaId: Scalars['Int'];
  /** For which type of media the review is for */
  mediaType?: Maybe<MediaType>;
  /** A short summary of the review */
  summary?: Maybe<Scalars['String']>;
  /** The main review body text */
  body?: Maybe<Scalars['String']>;
  /** The total user rating of the review */
  rating?: Maybe<Scalars['Int']>;
  /** The amount of user ratings of the review */
  ratingAmount?: Maybe<Scalars['Int']>;
  /** The rating of the review by currently authenticated user */
  userRating?: Maybe<ReviewRating>;
  /** The review score of the media */
  score?: Maybe<Scalars['Int']>;
  /** If the review is not yet publicly published and is only viewable by creator */
  private?: Maybe<Scalars['Boolean']>;
  /** The url for the review page on the AniList website */
  siteUrl?: Maybe<Scalars['String']>;
  /** The time of the thread creation */
  createdAt: Scalars['Int'];
  /** The time of the thread last update */
  updatedAt: Scalars['Int'];
  /** The creator of the review */
  user?: Maybe<User>;
  /** The media the review is of */
  media?: Maybe<Media>;
};

/** A Review that features in an anime or manga */
export type ReviewBodyArgs = {
  asHtml?: InputMaybe<Scalars['Boolean']>;
};

export type ReviewConnection = {
  __typename?: 'ReviewConnection';
  edges?: Maybe<Array<Maybe<ReviewEdge>>>;
  nodes?: Maybe<Array<Maybe<Review>>>;
  /** The pagination information */
  pageInfo?: Maybe<PageInfo>;
};

/** Review connection edge */
export type ReviewEdge = {
  __typename?: 'ReviewEdge';
  node?: Maybe<Review>;
};

/** Review rating enums */
export enum ReviewRating {
  NoVote = 'NO_VOTE',
  UpVote = 'UP_VOTE',
  DownVote = 'DOWN_VOTE'
}

/** Review sort enums */
export enum ReviewSort {
  Id = 'ID',
  IdDesc = 'ID_DESC',
  Score = 'SCORE',
  ScoreDesc = 'SCORE_DESC',
  Rating = 'RATING',
  RatingDesc = 'RATING_DESC',
  CreatedAt = 'CREATED_AT',
  CreatedAtDesc = 'CREATED_AT_DESC',
  UpdatedAt = 'UPDATED_AT',
  UpdatedAtDesc = 'UPDATED_AT_DESC'
}

/** Feed of mod edit activity */
export type RevisionHistory = {
  __typename?: 'RevisionHistory';
  /** The id of the media */
  id: Scalars['Int'];
  /** The action taken on the objects */
  action?: Maybe<RevisionHistoryAction>;
  /** A JSON object of the fields that changed */
  changes?: Maybe<Scalars['Json']>;
  /** The user who made the edit to the object */
  user?: Maybe<User>;
  /** The media the mod feed entry references */
  media?: Maybe<Media>;
  /** The character the mod feed entry references */
  character?: Maybe<Character>;
  /** The staff member the mod feed entry references */
  staff?: Maybe<Staff>;
  /** The studio the mod feed entry references */
  studio?: Maybe<Studio>;
  /** The external link source the mod feed entry references */
  externalLink?: Maybe<MediaExternalLink>;
  /** When the mod feed entry was created */
  createdAt?: Maybe<Scalars['Int']>;
};

/** Revision history actions */
export enum RevisionHistoryAction {
  Create = 'CREATE',
  Edit = 'EDIT'
}

/** A user's list score distribution. */
export type ScoreDistribution = {
  __typename?: 'ScoreDistribution';
  score?: Maybe<Scalars['Int']>;
  /** The amount of list entries with this score */
  amount?: Maybe<Scalars['Int']>;
};

/** Media list scoring type */
export enum ScoreFormat {
  /** An integer from 0-100 */
  Point_100 = 'POINT_100',
  /** A float from 0-10 with 1 decimal place */
  Point_10Decimal = 'POINT_10_DECIMAL',
  /** An integer from 0-10 */
  Point_10 = 'POINT_10',
  /** An integer from 0-5. Should be represented in Stars */
  Point_5 = 'POINT_5',
  /** An integer from 0-3. Should be represented in Smileys. 0 => No Score, 1 => :(, 2 => :|, 3 => :) */
  Point_3 = 'POINT_3'
}

export type SiteStatistics = {
  __typename?: 'SiteStatistics';
  users?: Maybe<SiteTrendConnection>;
  anime?: Maybe<SiteTrendConnection>;
  manga?: Maybe<SiteTrendConnection>;
  characters?: Maybe<SiteTrendConnection>;
  staff?: Maybe<SiteTrendConnection>;
  studios?: Maybe<SiteTrendConnection>;
  reviews?: Maybe<SiteTrendConnection>;
};

export type SiteStatisticsUsersArgs = {
  sort?: InputMaybe<Array<InputMaybe<SiteTrendSort>>>;
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
};

export type SiteStatisticsAnimeArgs = {
  sort?: InputMaybe<Array<InputMaybe<SiteTrendSort>>>;
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
};

export type SiteStatisticsMangaArgs = {
  sort?: InputMaybe<Array<InputMaybe<SiteTrendSort>>>;
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
};

export type SiteStatisticsCharactersArgs = {
  sort?: InputMaybe<Array<InputMaybe<SiteTrendSort>>>;
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
};

export type SiteStatisticsStaffArgs = {
  sort?: InputMaybe<Array<InputMaybe<SiteTrendSort>>>;
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
};

export type SiteStatisticsStudiosArgs = {
  sort?: InputMaybe<Array<InputMaybe<SiteTrendSort>>>;
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
};

export type SiteStatisticsReviewsArgs = {
  sort?: InputMaybe<Array<InputMaybe<SiteTrendSort>>>;
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
};

/** Daily site statistics */
export type SiteTrend = {
  __typename?: 'SiteTrend';
  /** The day the data was recorded (timestamp) */
  date: Scalars['Int'];
  count: Scalars['Int'];
  /** The change from yesterday */
  change: Scalars['Int'];
};

export type SiteTrendConnection = {
  __typename?: 'SiteTrendConnection';
  edges?: Maybe<Array<Maybe<SiteTrendEdge>>>;
  nodes?: Maybe<Array<Maybe<SiteTrend>>>;
  /** The pagination information */
  pageInfo?: Maybe<PageInfo>;
};

/** Site trend connection edge */
export type SiteTrendEdge = {
  __typename?: 'SiteTrendEdge';
  node?: Maybe<SiteTrend>;
};

/** Site trend sort enums */
export enum SiteTrendSort {
  Date = 'DATE',
  DateDesc = 'DATE_DESC',
  Count = 'COUNT',
  CountDesc = 'COUNT_DESC',
  Change = 'CHANGE',
  ChangeDesc = 'CHANGE_DESC'
}

/** Voice actors or production staff */
export type Staff = {
  __typename?: 'Staff';
  /** The id of the staff member */
  id: Scalars['Int'];
  /** The names of the staff member */
  name?: Maybe<StaffName>;
  /**
   * The primary language the staff member dub's in
   * @deprecated Replaced with languageV2
   */
  language?: Maybe<StaffLanguage>;
  /**
   * The primary language of the staff member. Current values: Japanese, English,
   * Korean, Italian, Spanish, Portuguese, French, German, Hebrew, Hungarian,
   * Chinese, Arabic, Filipino, Catalan, Finnish, Turkish, Dutch, Swedish, Thai,
   * Tagalog, Malaysian, Indonesian, Vietnamese, Nepali, Hindi, Urdu
   */
  languageV2?: Maybe<Scalars['String']>;
  /** The staff images */
  image?: Maybe<StaffImage>;
  /** A general description of the staff member */
  description?: Maybe<Scalars['String']>;
  /** The person's primary occupations */
  primaryOccupations?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** The staff's gender. Usually Male, Female, or Non-binary but can be any string. */
  gender?: Maybe<Scalars['String']>;
  dateOfBirth?: Maybe<FuzzyDate>;
  dateOfDeath?: Maybe<FuzzyDate>;
  /** The person's age in years */
  age?: Maybe<Scalars['Int']>;
  /** [startYear, endYear] (If the 2nd value is not present staff is still active) */
  yearsActive?: Maybe<Array<Maybe<Scalars['Int']>>>;
  /** The persons birthplace or hometown */
  homeTown?: Maybe<Scalars['String']>;
  /** The persons blood type */
  bloodType?: Maybe<Scalars['String']>;
  /** If the staff member is marked as favourite by the currently authenticated user */
  isFavourite: Scalars['Boolean'];
  /** If the staff member is blocked from being added to favourites */
  isFavouriteBlocked: Scalars['Boolean'];
  /** The url for the staff page on the AniList website */
  siteUrl?: Maybe<Scalars['String']>;
  /** Media where the staff member has a production role */
  staffMedia?: Maybe<MediaConnection>;
  /** Characters voiced by the actor */
  characters?: Maybe<CharacterConnection>;
  /** Media the actor voiced characters in. (Same data as characters with media as node instead of characters) */
  characterMedia?: Maybe<MediaConnection>;
  /** @deprecated No data available */
  updatedAt?: Maybe<Scalars['Int']>;
  /** Staff member that the submission is referencing */
  staff?: Maybe<Staff>;
  /** Submitter for the submission */
  submitter?: Maybe<User>;
  /** Status of the submission */
  submissionStatus?: Maybe<Scalars['Int']>;
  /** Inner details of submission status */
  submissionNotes?: Maybe<Scalars['String']>;
  /** The amount of user's who have favourited the staff member */
  favourites?: Maybe<Scalars['Int']>;
  /** Notes for site moderators */
  modNotes?: Maybe<Scalars['String']>;
};

/** Voice actors or production staff */
export type StaffDescriptionArgs = {
  asHtml?: InputMaybe<Scalars['Boolean']>;
};

/** Voice actors or production staff */
export type StaffStaffMediaArgs = {
  sort?: InputMaybe<Array<InputMaybe<MediaSort>>>;
  type?: InputMaybe<MediaType>;
  onList?: InputMaybe<Scalars['Boolean']>;
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
};

/** Voice actors or production staff */
export type StaffCharactersArgs = {
  sort?: InputMaybe<Array<InputMaybe<CharacterSort>>>;
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
};

/** Voice actors or production staff */
export type StaffCharacterMediaArgs = {
  sort?: InputMaybe<Array<InputMaybe<MediaSort>>>;
  onList?: InputMaybe<Scalars['Boolean']>;
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
};

export type StaffConnection = {
  __typename?: 'StaffConnection';
  edges?: Maybe<Array<Maybe<StaffEdge>>>;
  nodes?: Maybe<Array<Maybe<Staff>>>;
  /** The pagination information */
  pageInfo?: Maybe<PageInfo>;
};

/** Staff connection edge */
export type StaffEdge = {
  __typename?: 'StaffEdge';
  node?: Maybe<Staff>;
  /** The id of the connection */
  id?: Maybe<Scalars['Int']>;
  /** The role of the staff member in the production of the media */
  role?: Maybe<Scalars['String']>;
  /** The order the staff should be displayed from the users favourites */
  favouriteOrder?: Maybe<Scalars['Int']>;
};

export type StaffImage = {
  __typename?: 'StaffImage';
  /** The person's image of media at its largest size */
  large?: Maybe<Scalars['String']>;
  /** The person's image of media at medium size */
  medium?: Maybe<Scalars['String']>;
};

/** The primary language of the voice actor */
export enum StaffLanguage {
  /** Japanese */
  Japanese = 'JAPANESE',
  /** English */
  English = 'ENGLISH',
  /** Korean */
  Korean = 'KOREAN',
  /** Italian */
  Italian = 'ITALIAN',
  /** Spanish */
  Spanish = 'SPANISH',
  /** Portuguese */
  Portuguese = 'PORTUGUESE',
  /** French */
  French = 'FRENCH',
  /** German */
  German = 'GERMAN',
  /** Hebrew */
  Hebrew = 'HEBREW',
  /** Hungarian */
  Hungarian = 'HUNGARIAN'
}

/** The names of the staff member */
export type StaffName = {
  __typename?: 'StaffName';
  /** The person's given name */
  first?: Maybe<Scalars['String']>;
  /** The person's middle name */
  middle?: Maybe<Scalars['String']>;
  /** The person's surname */
  last?: Maybe<Scalars['String']>;
  /** The person's first and last name */
  full?: Maybe<Scalars['String']>;
  /** The person's full name in their native language */
  native?: Maybe<Scalars['String']>;
  /** Other names the staff member might be referred to as (pen names) */
  alternative?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** The currently authenticated users preferred name language. Default romaji for non-authenticated */
  userPreferred?: Maybe<Scalars['String']>;
};

/** The names of the staff member */
export type StaffNameInput = {
  /** The person's given name */
  first?: InputMaybe<Scalars['String']>;
  /** The person's middle name */
  middle?: InputMaybe<Scalars['String']>;
  /** The person's surname */
  last?: InputMaybe<Scalars['String']>;
  /** The person's full name in their native language */
  native?: InputMaybe<Scalars['String']>;
  /** Other names the character might be referred by */
  alternative?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** Voice actor role for a character */
export type StaffRoleType = {
  __typename?: 'StaffRoleType';
  /** The voice actors of the character */
  voiceActor?: Maybe<Staff>;
  /** Notes regarding the VA's role for the character */
  roleNotes?: Maybe<Scalars['String']>;
  /** Used for grouping roles where multiple dubs exist for the same language. Either dubbing company name or language variant. */
  dubGroup?: Maybe<Scalars['String']>;
};

/** Staff sort enums */
export enum StaffSort {
  Id = 'ID',
  IdDesc = 'ID_DESC',
  Role = 'ROLE',
  RoleDesc = 'ROLE_DESC',
  Language = 'LANGUAGE',
  LanguageDesc = 'LANGUAGE_DESC',
  SearchMatch = 'SEARCH_MATCH',
  Favourites = 'FAVOURITES',
  FavouritesDesc = 'FAVOURITES_DESC',
  /** Order manually decided by moderators */
  Relevance = 'RELEVANCE'
}

/** User's staff statistics */
export type StaffStats = {
  __typename?: 'StaffStats';
  staff?: Maybe<Staff>;
  amount?: Maybe<Scalars['Int']>;
  meanScore?: Maybe<Scalars['Int']>;
  /** The amount of time in minutes the staff member has been watched by the user */
  timeWatched?: Maybe<Scalars['Int']>;
};

/** A submission for a staff that features in an anime or manga */
export type StaffSubmission = {
  __typename?: 'StaffSubmission';
  /** The id of the submission */
  id: Scalars['Int'];
  /** Staff that the submission is referencing */
  staff?: Maybe<Staff>;
  /** The staff submission changes */
  submission?: Maybe<Staff>;
  /** Submitter for the submission */
  submitter?: Maybe<User>;
  /** Data Mod assigned to handle the submission */
  assignee?: Maybe<User>;
  /** Status of the submission */
  status?: Maybe<SubmissionStatus>;
  /** Inner details of submission status */
  notes?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  /** Whether the submission is locked */
  locked?: Maybe<Scalars['Boolean']>;
  createdAt?: Maybe<Scalars['Int']>;
};

/** The distribution of the watching/reading status of media or a user's list */
export type StatusDistribution = {
  __typename?: 'StatusDistribution';
  /** The day the activity took place (Unix timestamp) */
  status?: Maybe<MediaListStatus>;
  /** The amount of entries with this status */
  amount?: Maybe<Scalars['Int']>;
};

/** Animation or production company */
export type Studio = {
  __typename?: 'Studio';
  /** The id of the studio */
  id: Scalars['Int'];
  /** The name of the studio */
  name: Scalars['String'];
  /** If the studio is an animation studio or a different kind of company */
  isAnimationStudio: Scalars['Boolean'];
  /** The media the studio has worked on */
  media?: Maybe<MediaConnection>;
  /** The url for the studio page on the AniList website */
  siteUrl?: Maybe<Scalars['String']>;
  /** If the studio is marked as favourite by the currently authenticated user */
  isFavourite: Scalars['Boolean'];
  /** The amount of user's who have favourited the studio */
  favourites?: Maybe<Scalars['Int']>;
};

/** Animation or production company */
export type StudioMediaArgs = {
  sort?: InputMaybe<Array<InputMaybe<MediaSort>>>;
  isMain?: InputMaybe<Scalars['Boolean']>;
  onList?: InputMaybe<Scalars['Boolean']>;
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
};

export type StudioConnection = {
  __typename?: 'StudioConnection';
  edges?: Maybe<Array<Maybe<StudioEdge>>>;
  nodes?: Maybe<Array<Maybe<Studio>>>;
  /** The pagination information */
  pageInfo?: Maybe<PageInfo>;
};

/** Studio connection edge */
export type StudioEdge = {
  __typename?: 'StudioEdge';
  node?: Maybe<Studio>;
  /** The id of the connection */
  id?: Maybe<Scalars['Int']>;
  /** If the studio is the main animation studio of the anime */
  isMain: Scalars['Boolean'];
  /** The order the character should be displayed from the users favourites */
  favouriteOrder?: Maybe<Scalars['Int']>;
};

/** Studio sort enums */
export enum StudioSort {
  Id = 'ID',
  IdDesc = 'ID_DESC',
  Name = 'NAME',
  NameDesc = 'NAME_DESC',
  SearchMatch = 'SEARCH_MATCH',
  Favourites = 'FAVOURITES',
  FavouritesDesc = 'FAVOURITES_DESC'
}

/** User's studio statistics */
export type StudioStats = {
  __typename?: 'StudioStats';
  studio?: Maybe<Studio>;
  amount?: Maybe<Scalars['Int']>;
  meanScore?: Maybe<Scalars['Int']>;
  /** The amount of time in minutes the studio's works have been watched by the user */
  timeWatched?: Maybe<Scalars['Int']>;
};

/** Submission sort enums */
export enum SubmissionSort {
  Id = 'ID',
  IdDesc = 'ID_DESC'
}

/** Submission status */
export enum SubmissionStatus {
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  PartiallyAccepted = 'PARTIALLY_ACCEPTED',
  Accepted = 'ACCEPTED'
}

/** User's tag statistics */
export type TagStats = {
  __typename?: 'TagStats';
  tag?: Maybe<MediaTag>;
  amount?: Maybe<Scalars['Int']>;
  meanScore?: Maybe<Scalars['Int']>;
  /** The amount of time in minutes the tag has been watched by the user */
  timeWatched?: Maybe<Scalars['Int']>;
};

/** User text activity */
export type TextActivity = {
  __typename?: 'TextActivity';
  /** The id of the activity */
  id: Scalars['Int'];
  /** The user id of the activity's creator */
  userId?: Maybe<Scalars['Int']>;
  /** The type of activity */
  type?: Maybe<ActivityType>;
  /** The number of activity replies */
  replyCount: Scalars['Int'];
  /** The status text (Markdown) */
  text?: Maybe<Scalars['String']>;
  /** The url for the activity page on the AniList website */
  siteUrl?: Maybe<Scalars['String']>;
  /** If the activity is locked and can receive replies */
  isLocked?: Maybe<Scalars['Boolean']>;
  /** If the currently authenticated user is subscribed to the activity */
  isSubscribed?: Maybe<Scalars['Boolean']>;
  /** The amount of likes the activity has */
  likeCount: Scalars['Int'];
  /** If the currently authenticated user liked the activity */
  isLiked?: Maybe<Scalars['Boolean']>;
  /** If the activity is pinned to the top of the users activity feed */
  isPinned?: Maybe<Scalars['Boolean']>;
  /** The time the activity was created at */
  createdAt: Scalars['Int'];
  /** The user who created the activity */
  user?: Maybe<User>;
  /** The written replies to the activity */
  replies?: Maybe<Array<Maybe<ActivityReply>>>;
  /** The users who liked the activity */
  likes?: Maybe<Array<Maybe<User>>>;
};

/** User text activity */
export type TextActivityTextArgs = {
  asHtml?: InputMaybe<Scalars['Boolean']>;
};

/** Forum Thread */
export type Thread = {
  __typename?: 'Thread';
  /** The id of the thread */
  id: Scalars['Int'];
  /** The title of the thread */
  title?: Maybe<Scalars['String']>;
  /** The text body of the thread (Markdown) */
  body?: Maybe<Scalars['String']>;
  /** The id of the thread owner user */
  userId: Scalars['Int'];
  /** The id of the user who most recently commented on the thread */
  replyUserId?: Maybe<Scalars['Int']>;
  /** The id of the most recent comment on the thread */
  replyCommentId?: Maybe<Scalars['Int']>;
  /** The number of comments on the thread */
  replyCount?: Maybe<Scalars['Int']>;
  /** The number of times users have viewed the thread */
  viewCount?: Maybe<Scalars['Int']>;
  /** If the thread is locked and can receive comments */
  isLocked?: Maybe<Scalars['Boolean']>;
  /** If the thread is stickied and should be displayed at the top of the page */
  isSticky?: Maybe<Scalars['Boolean']>;
  /** If the currently authenticated user is subscribed to the thread */
  isSubscribed?: Maybe<Scalars['Boolean']>;
  /** The amount of likes the thread has */
  likeCount: Scalars['Int'];
  /** If the currently authenticated user liked the thread */
  isLiked?: Maybe<Scalars['Boolean']>;
  /** The time of the last reply */
  repliedAt?: Maybe<Scalars['Int']>;
  /** The time of the thread creation */
  createdAt: Scalars['Int'];
  /** The time of the thread last update */
  updatedAt: Scalars['Int'];
  /** The owner of the thread */
  user?: Maybe<User>;
  /** The user to last reply to the thread */
  replyUser?: Maybe<User>;
  /** The users who liked the thread */
  likes?: Maybe<Array<Maybe<User>>>;
  /** The url for the thread page on the AniList website */
  siteUrl?: Maybe<Scalars['String']>;
  /** The categories of the thread */
  categories?: Maybe<Array<Maybe<ThreadCategory>>>;
  /** The media categories of the thread */
  mediaCategories?: Maybe<Array<Maybe<Media>>>;
};

/** Forum Thread */
export type ThreadBodyArgs = {
  asHtml?: InputMaybe<Scalars['Boolean']>;
};

/** A forum thread category */
export type ThreadCategory = {
  __typename?: 'ThreadCategory';
  /** The id of the category */
  id: Scalars['Int'];
  /** The name of the category */
  name: Scalars['String'];
};

/** Forum Thread Comment */
export type ThreadComment = {
  __typename?: 'ThreadComment';
  /** The id of the comment */
  id: Scalars['Int'];
  /** The user id of the comment's owner */
  userId?: Maybe<Scalars['Int']>;
  /** The id of thread the comment belongs to */
  threadId?: Maybe<Scalars['Int']>;
  /** The text content of the comment (Markdown) */
  comment?: Maybe<Scalars['String']>;
  /** The amount of likes the comment has */
  likeCount: Scalars['Int'];
  /** If the currently authenticated user liked the comment */
  isLiked?: Maybe<Scalars['Boolean']>;
  /** The url for the comment page on the AniList website */
  siteUrl?: Maybe<Scalars['String']>;
  /** The time of the comments creation */
  createdAt: Scalars['Int'];
  /** The time of the comments last update */
  updatedAt: Scalars['Int'];
  /** The thread the comment belongs to */
  thread?: Maybe<Thread>;
  /** The user who created the comment */
  user?: Maybe<User>;
  /** The users who liked the comment */
  likes?: Maybe<Array<Maybe<User>>>;
  /** The comment's child reply comments */
  childComments?: Maybe<Scalars['Json']>;
  /** If the comment tree is locked and may not receive replies or edits */
  isLocked?: Maybe<Scalars['Boolean']>;
};

/** Forum Thread Comment */
export type ThreadCommentCommentArgs = {
  asHtml?: InputMaybe<Scalars['Boolean']>;
};

/** Notification for when a thread comment is liked */
export type ThreadCommentLikeNotification = {
  __typename?: 'ThreadCommentLikeNotification';
  /** The id of the Notification */
  id: Scalars['Int'];
  /** The id of the user who liked to the activity */
  userId: Scalars['Int'];
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The id of the activity which was liked */
  commentId: Scalars['Int'];
  /** The notification context text */
  context?: Maybe<Scalars['String']>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars['Int']>;
  /** The thread that the relevant comment belongs to */
  thread?: Maybe<Thread>;
  /** The thread comment that was liked */
  comment?: Maybe<ThreadComment>;
  /** The user who liked the activity */
  user?: Maybe<User>;
};

/** Notification for when authenticated user is @ mentioned in a forum thread comment */
export type ThreadCommentMentionNotification = {
  __typename?: 'ThreadCommentMentionNotification';
  /** The id of the Notification */
  id: Scalars['Int'];
  /** The id of the user who mentioned the authenticated user */
  userId: Scalars['Int'];
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The id of the comment where mentioned */
  commentId: Scalars['Int'];
  /** The notification context text */
  context?: Maybe<Scalars['String']>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars['Int']>;
  /** The thread that the relevant comment belongs to */
  thread?: Maybe<Thread>;
  /** The thread comment that included the @ mention */
  comment?: Maybe<ThreadComment>;
  /** The user who mentioned the authenticated user */
  user?: Maybe<User>;
};

/** Notification for when a user replies to your forum thread comment */
export type ThreadCommentReplyNotification = {
  __typename?: 'ThreadCommentReplyNotification';
  /** The id of the Notification */
  id: Scalars['Int'];
  /** The id of the user who create the comment reply */
  userId: Scalars['Int'];
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The id of the reply comment */
  commentId: Scalars['Int'];
  /** The notification context text */
  context?: Maybe<Scalars['String']>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars['Int']>;
  /** The thread that the relevant comment belongs to */
  thread?: Maybe<Thread>;
  /** The reply thread comment */
  comment?: Maybe<ThreadComment>;
  /** The user who replied to the activity */
  user?: Maybe<User>;
};

/** Thread comments sort enums */
export enum ThreadCommentSort {
  Id = 'ID',
  IdDesc = 'ID_DESC'
}

/** Notification for when a user replies to a subscribed forum thread */
export type ThreadCommentSubscribedNotification = {
  __typename?: 'ThreadCommentSubscribedNotification';
  /** The id of the Notification */
  id: Scalars['Int'];
  /** The id of the user who commented on the thread */
  userId: Scalars['Int'];
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The id of the new comment in the subscribed thread */
  commentId: Scalars['Int'];
  /** The notification context text */
  context?: Maybe<Scalars['String']>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars['Int']>;
  /** The thread that the relevant comment belongs to */
  thread?: Maybe<Thread>;
  /** The reply thread comment */
  comment?: Maybe<ThreadComment>;
  /** The user who replied to the subscribed thread */
  user?: Maybe<User>;
};

/** Notification for when a thread is liked */
export type ThreadLikeNotification = {
  __typename?: 'ThreadLikeNotification';
  /** The id of the Notification */
  id: Scalars['Int'];
  /** The id of the user who liked to the activity */
  userId: Scalars['Int'];
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The id of the thread which was liked */
  threadId: Scalars['Int'];
  /** The notification context text */
  context?: Maybe<Scalars['String']>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars['Int']>;
  /** The thread that the relevant comment belongs to */
  thread?: Maybe<Thread>;
  /** The liked thread comment */
  comment?: Maybe<ThreadComment>;
  /** The user who liked the activity */
  user?: Maybe<User>;
};

/** Thread sort enums */
export enum ThreadSort {
  Id = 'ID',
  IdDesc = 'ID_DESC',
  Title = 'TITLE',
  TitleDesc = 'TITLE_DESC',
  CreatedAt = 'CREATED_AT',
  CreatedAtDesc = 'CREATED_AT_DESC',
  UpdatedAt = 'UPDATED_AT',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
  RepliedAt = 'REPLIED_AT',
  RepliedAtDesc = 'REPLIED_AT_DESC',
  ReplyCount = 'REPLY_COUNT',
  ReplyCountDesc = 'REPLY_COUNT_DESC',
  ViewCount = 'VIEW_COUNT',
  ViewCountDesc = 'VIEW_COUNT_DESC',
  IsSticky = 'IS_STICKY',
  SearchMatch = 'SEARCH_MATCH'
}

/** A user */
export type User = {
  __typename?: 'User';
  /** The id of the user */
  id: Scalars['Int'];
  /** The name of the user */
  name: Scalars['String'];
  /** The bio written by user (Markdown) */
  about?: Maybe<Scalars['String']>;
  /** The user's avatar images */
  avatar?: Maybe<UserAvatar>;
  /** The user's banner images */
  bannerImage?: Maybe<Scalars['String']>;
  /** If the authenticated user if following this user */
  isFollowing?: Maybe<Scalars['Boolean']>;
  /** If this user if following the authenticated user */
  isFollower?: Maybe<Scalars['Boolean']>;
  /** If the user is blocked by the authenticated user */
  isBlocked?: Maybe<Scalars['Boolean']>;
  bans?: Maybe<Scalars['Json']>;
  /** The user's general options */
  options?: Maybe<UserOptions>;
  /** The user's media list options */
  mediaListOptions?: Maybe<MediaListOptions>;
  /** The users favourites */
  favourites?: Maybe<Favourites>;
  /** The users anime & manga list statistics */
  statistics?: Maybe<UserStatisticTypes>;
  /** The number of unread notifications the user has */
  unreadNotificationCount?: Maybe<Scalars['Int']>;
  /** The url for the user page on the AniList website */
  siteUrl?: Maybe<Scalars['String']>;
  /** The donation tier of the user */
  donatorTier?: Maybe<Scalars['Int']>;
  /** Custom donation badge text */
  donatorBadge?: Maybe<Scalars['String']>;
  /** The user's moderator roles if they are a site moderator */
  moderatorRoles?: Maybe<Array<Maybe<ModRole>>>;
  /** When the user's account was created. (Does not exist for accounts created before 2020) */
  createdAt?: Maybe<Scalars['Int']>;
  /** When the user's data was last updated */
  updatedAt?: Maybe<Scalars['Int']>;
  /**
   * The user's statistics
   * @deprecated Deprecated. Replaced with statistics field.
   */
  stats?: Maybe<UserStats>;
  /**
   * If the user is a moderator or data moderator
   * @deprecated Deprecated. Replaced with moderatorRoles field.
   */
  moderatorStatus?: Maybe<Scalars['String']>;
  /** The user's previously used names. */
  previousNames?: Maybe<Array<Maybe<UserPreviousName>>>;
};

/** A user */
export type UserAboutArgs = {
  asHtml?: InputMaybe<Scalars['Boolean']>;
};

/** A user */
export type UserFavouritesArgs = {
  page?: InputMaybe<Scalars['Int']>;
};

/** A user's activity history stats. */
export type UserActivityHistory = {
  __typename?: 'UserActivityHistory';
  /** The day the activity took place (Unix timestamp) */
  date?: Maybe<Scalars['Int']>;
  /** The amount of activity on the day */
  amount?: Maybe<Scalars['Int']>;
  /** The level of activity represented on a 1-10 scale */
  level?: Maybe<Scalars['Int']>;
};

/** A user's avatars */
export type UserAvatar = {
  __typename?: 'UserAvatar';
  /** The avatar of user at its largest size */
  large?: Maybe<Scalars['String']>;
  /** The avatar of user at medium size */
  medium?: Maybe<Scalars['String']>;
};

export type UserCountryStatistic = {
  __typename?: 'UserCountryStatistic';
  count: Scalars['Int'];
  meanScore: Scalars['Float'];
  minutesWatched: Scalars['Int'];
  chaptersRead: Scalars['Int'];
  mediaIds: Array<Maybe<Scalars['Int']>>;
  country?: Maybe<Scalars['CountryCode']>;
};

export type UserFormatStatistic = {
  __typename?: 'UserFormatStatistic';
  count: Scalars['Int'];
  meanScore: Scalars['Float'];
  minutesWatched: Scalars['Int'];
  chaptersRead: Scalars['Int'];
  mediaIds: Array<Maybe<Scalars['Int']>>;
  format?: Maybe<MediaFormat>;
};

export type UserGenreStatistic = {
  __typename?: 'UserGenreStatistic';
  count: Scalars['Int'];
  meanScore: Scalars['Float'];
  minutesWatched: Scalars['Int'];
  chaptersRead: Scalars['Int'];
  mediaIds: Array<Maybe<Scalars['Int']>>;
  genre?: Maybe<Scalars['String']>;
};

export type UserLengthStatistic = {
  __typename?: 'UserLengthStatistic';
  count: Scalars['Int'];
  meanScore: Scalars['Float'];
  minutesWatched: Scalars['Int'];
  chaptersRead: Scalars['Int'];
  mediaIds: Array<Maybe<Scalars['Int']>>;
  length?: Maybe<Scalars['String']>;
};

/** User data for moderators */
export type UserModData = {
  __typename?: 'UserModData';
  alts?: Maybe<Array<Maybe<User>>>;
  bans?: Maybe<Scalars['Json']>;
  ip?: Maybe<Scalars['Json']>;
  counts?: Maybe<Scalars['Json']>;
  privacy?: Maybe<Scalars['Int']>;
  email?: Maybe<Scalars['String']>;
};

/** A user's general options */
export type UserOptions = {
  __typename?: 'UserOptions';
  /** The language the user wants to see media titles in */
  titleLanguage?: Maybe<UserTitleLanguage>;
  /** Whether the user has enabled viewing of 18+ content */
  displayAdultContent?: Maybe<Scalars['Boolean']>;
  /** Whether the user receives notifications when a show they are watching aires */
  airingNotifications?: Maybe<Scalars['Boolean']>;
  /** Profile highlight color (blue, purple, pink, orange, red, green, gray) */
  profileColor?: Maybe<Scalars['String']>;
  /** Notification options */
  notificationOptions?: Maybe<Array<Maybe<NotificationOption>>>;
  /** The user's timezone offset (Auth user only) */
  timezone?: Maybe<Scalars['String']>;
  /** Minutes between activity for them to be merged together. 0 is Never, Above 2 weeks (20160 mins) is Always. */
  activityMergeTime?: Maybe<Scalars['Int']>;
  /** The language the user wants to see staff and character names in */
  staffNameLanguage?: Maybe<UserStaffNameLanguage>;
  /** Whether the user only allow messages from users they follow */
  restrictMessagesToFollowing?: Maybe<Scalars['Boolean']>;
  /** The list activity types the user has disabled from being created from list updates */
  disabledListActivity?: Maybe<Array<Maybe<ListActivityOption>>>;
};

/** A user's previous name */
export type UserPreviousName = {
  __typename?: 'UserPreviousName';
  /** A previous name of the user. */
  name?: Maybe<Scalars['String']>;
  /** When the user first changed from this name. */
  createdAt?: Maybe<Scalars['Int']>;
  /** When the user most recently changed from this name. */
  updatedAt?: Maybe<Scalars['Int']>;
};

export type UserReleaseYearStatistic = {
  __typename?: 'UserReleaseYearStatistic';
  count: Scalars['Int'];
  meanScore: Scalars['Float'];
  minutesWatched: Scalars['Int'];
  chaptersRead: Scalars['Int'];
  mediaIds: Array<Maybe<Scalars['Int']>>;
  releaseYear?: Maybe<Scalars['Int']>;
};

export type UserScoreStatistic = {
  __typename?: 'UserScoreStatistic';
  count: Scalars['Int'];
  meanScore: Scalars['Float'];
  minutesWatched: Scalars['Int'];
  chaptersRead: Scalars['Int'];
  mediaIds: Array<Maybe<Scalars['Int']>>;
  score?: Maybe<Scalars['Int']>;
};

/** User sort enums */
export enum UserSort {
  Id = 'ID',
  IdDesc = 'ID_DESC',
  Username = 'USERNAME',
  UsernameDesc = 'USERNAME_DESC',
  WatchedTime = 'WATCHED_TIME',
  WatchedTimeDesc = 'WATCHED_TIME_DESC',
  ChaptersRead = 'CHAPTERS_READ',
  ChaptersReadDesc = 'CHAPTERS_READ_DESC',
  SearchMatch = 'SEARCH_MATCH'
}

/** The language the user wants to see staff and character names in */
export enum UserStaffNameLanguage {
  /** The romanization of the staff or character's native name, with western name ordering */
  RomajiWestern = 'ROMAJI_WESTERN',
  /** The romanization of the staff or character's native name */
  Romaji = 'ROMAJI',
  /** The staff or character's name in their native language */
  Native = 'NATIVE'
}

export type UserStaffStatistic = {
  __typename?: 'UserStaffStatistic';
  count: Scalars['Int'];
  meanScore: Scalars['Float'];
  minutesWatched: Scalars['Int'];
  chaptersRead: Scalars['Int'];
  mediaIds: Array<Maybe<Scalars['Int']>>;
  staff?: Maybe<Staff>;
};

export type UserStartYearStatistic = {
  __typename?: 'UserStartYearStatistic';
  count: Scalars['Int'];
  meanScore: Scalars['Float'];
  minutesWatched: Scalars['Int'];
  chaptersRead: Scalars['Int'];
  mediaIds: Array<Maybe<Scalars['Int']>>;
  startYear?: Maybe<Scalars['Int']>;
};

export type UserStatistics = {
  __typename?: 'UserStatistics';
  count: Scalars['Int'];
  meanScore: Scalars['Float'];
  standardDeviation: Scalars['Float'];
  minutesWatched: Scalars['Int'];
  episodesWatched: Scalars['Int'];
  chaptersRead: Scalars['Int'];
  volumesRead: Scalars['Int'];
  formats?: Maybe<Array<Maybe<UserFormatStatistic>>>;
  statuses?: Maybe<Array<Maybe<UserStatusStatistic>>>;
  scores?: Maybe<Array<Maybe<UserScoreStatistic>>>;
  lengths?: Maybe<Array<Maybe<UserLengthStatistic>>>;
  releaseYears?: Maybe<Array<Maybe<UserReleaseYearStatistic>>>;
  startYears?: Maybe<Array<Maybe<UserStartYearStatistic>>>;
  genres?: Maybe<Array<Maybe<UserGenreStatistic>>>;
  tags?: Maybe<Array<Maybe<UserTagStatistic>>>;
  countries?: Maybe<Array<Maybe<UserCountryStatistic>>>;
  voiceActors?: Maybe<Array<Maybe<UserVoiceActorStatistic>>>;
  staff?: Maybe<Array<Maybe<UserStaffStatistic>>>;
  studios?: Maybe<Array<Maybe<UserStudioStatistic>>>;
};

export type UserStatisticsFormatsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<UserStatisticsSort>>>;
};

export type UserStatisticsStatusesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<UserStatisticsSort>>>;
};

export type UserStatisticsScoresArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<UserStatisticsSort>>>;
};

export type UserStatisticsLengthsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<UserStatisticsSort>>>;
};

export type UserStatisticsReleaseYearsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<UserStatisticsSort>>>;
};

export type UserStatisticsStartYearsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<UserStatisticsSort>>>;
};

export type UserStatisticsGenresArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<UserStatisticsSort>>>;
};

export type UserStatisticsTagsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<UserStatisticsSort>>>;
};

export type UserStatisticsCountriesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<UserStatisticsSort>>>;
};

export type UserStatisticsVoiceActorsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<UserStatisticsSort>>>;
};

export type UserStatisticsStaffArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<UserStatisticsSort>>>;
};

export type UserStatisticsStudiosArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<UserStatisticsSort>>>;
};

/** User statistics sort enum */
export enum UserStatisticsSort {
  Id = 'ID',
  IdDesc = 'ID_DESC',
  Count = 'COUNT',
  CountDesc = 'COUNT_DESC',
  Progress = 'PROGRESS',
  ProgressDesc = 'PROGRESS_DESC',
  MeanScore = 'MEAN_SCORE',
  MeanScoreDesc = 'MEAN_SCORE_DESC'
}

export type UserStatisticTypes = {
  __typename?: 'UserStatisticTypes';
  anime?: Maybe<UserStatistics>;
  manga?: Maybe<UserStatistics>;
};

/** A user's statistics */
export type UserStats = {
  __typename?: 'UserStats';
  /** The amount of anime the user has watched in minutes */
  watchedTime?: Maybe<Scalars['Int']>;
  /** The amount of manga chapters the user has read */
  chaptersRead?: Maybe<Scalars['Int']>;
  activityHistory?: Maybe<Array<Maybe<UserActivityHistory>>>;
  animeStatusDistribution?: Maybe<Array<Maybe<StatusDistribution>>>;
  mangaStatusDistribution?: Maybe<Array<Maybe<StatusDistribution>>>;
  animeScoreDistribution?: Maybe<Array<Maybe<ScoreDistribution>>>;
  mangaScoreDistribution?: Maybe<Array<Maybe<ScoreDistribution>>>;
  animeListScores?: Maybe<ListScoreStats>;
  mangaListScores?: Maybe<ListScoreStats>;
  favouredGenresOverview?: Maybe<Array<Maybe<GenreStats>>>;
  favouredGenres?: Maybe<Array<Maybe<GenreStats>>>;
  favouredTags?: Maybe<Array<Maybe<TagStats>>>;
  favouredActors?: Maybe<Array<Maybe<StaffStats>>>;
  favouredStaff?: Maybe<Array<Maybe<StaffStats>>>;
  favouredStudios?: Maybe<Array<Maybe<StudioStats>>>;
  favouredYears?: Maybe<Array<Maybe<YearStats>>>;
  favouredFormats?: Maybe<Array<Maybe<FormatStats>>>;
};

export type UserStatusStatistic = {
  __typename?: 'UserStatusStatistic';
  count: Scalars['Int'];
  meanScore: Scalars['Float'];
  minutesWatched: Scalars['Int'];
  chaptersRead: Scalars['Int'];
  mediaIds: Array<Maybe<Scalars['Int']>>;
  status?: Maybe<MediaListStatus>;
};

export type UserStudioStatistic = {
  __typename?: 'UserStudioStatistic';
  count: Scalars['Int'];
  meanScore: Scalars['Float'];
  minutesWatched: Scalars['Int'];
  chaptersRead: Scalars['Int'];
  mediaIds: Array<Maybe<Scalars['Int']>>;
  studio?: Maybe<Studio>;
};

export type UserTagStatistic = {
  __typename?: 'UserTagStatistic';
  count: Scalars['Int'];
  meanScore: Scalars['Float'];
  minutesWatched: Scalars['Int'];
  chaptersRead: Scalars['Int'];
  mediaIds: Array<Maybe<Scalars['Int']>>;
  tag?: Maybe<MediaTag>;
};

/** The language the user wants to see media titles in */
export enum UserTitleLanguage {
  /** The romanization of the native language title */
  Romaji = 'ROMAJI',
  /** The official english title */
  English = 'ENGLISH',
  /** Official title in it's native language */
  Native = 'NATIVE',
  /** The romanization of the native language title, stylised by media creator */
  RomajiStylised = 'ROMAJI_STYLISED',
  /** The official english title, stylised by media creator */
  EnglishStylised = 'ENGLISH_STYLISED',
  /** Official title in it's native language, stylised by media creator */
  NativeStylised = 'NATIVE_STYLISED'
}

export type UserVoiceActorStatistic = {
  __typename?: 'UserVoiceActorStatistic';
  count: Scalars['Int'];
  meanScore: Scalars['Float'];
  minutesWatched: Scalars['Int'];
  chaptersRead: Scalars['Int'];
  mediaIds: Array<Maybe<Scalars['Int']>>;
  voiceActor?: Maybe<Staff>;
  characterIds: Array<Maybe<Scalars['Int']>>;
};

/** User's year statistics */
export type YearStats = {
  __typename?: 'YearStats';
  year?: Maybe<Scalars['Int']>;
  amount?: Maybe<Scalars['Int']>;
  meanScore?: Maybe<Scalars['Int']>;
};
