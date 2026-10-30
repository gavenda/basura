import type { ButtonInteraction } from 'discord.js';
import type { AppContext } from '../../context';

export interface AppButtonHandler {
  /**
   * Matched against the segment before the first colon rather than the whole id.
   * Button ids carry their state inline (`card:<kind>:<id>:<page>`), so an exact match would never hit.
   */
  customId: string;
  handle: (context: AppContext, interaction: ButtonInteraction) => Promise<void>;
}
