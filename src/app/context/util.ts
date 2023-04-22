import { MessageComponent, MessageComponentTypes } from 'discord-interactions';
import { v4 as uuidv4 } from 'uuid';

export const convertComponents = (context: string, components: MessageComponent[]): MessageComponent[] => {
  const copy = structuredClone(components);
  const converted: MessageComponent[] = [];
  for (const actionRow of copy) {
    if (actionRow.type !== MessageComponentTypes.ACTION_ROW) {
      continue;
    }
    actionRow.components = actionRow.components.map((component) => {
      return {
        ...component,
        custom_id: `${context}:${component.custom_id}:${uuidv4()}`,
      };
    });
    converted.push(actionRow);
  }

  return converted;
};
