import { v4 as uuidv4 } from 'uuid';

export class Component {
  uniqueId: string;
  command: string;
  id: string;
  data: any;

  constructor(id: string, command: string, data: any) {
    this.id = id;
    this.command = command;
    this.data = data;
    this.uniqueId = uuidv4();
  }

  get key(): string {
    return `${this.command}:${this.id}:${this.uniqueId}`;
  }

  getData<T>(): T {
    return this.data as T;
  }
}
