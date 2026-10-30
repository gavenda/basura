import { getChatInputCommandData } from './chat-input';

/** Every command Discord should know about. */
export const getCommandData = () => [...getChatInputCommandData()];
