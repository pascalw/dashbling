import { Event } from "./Event";

export interface EventHistory {
  put(id: string, event: Event): Promise<void>;
  getAll(): Promise<Event[]>;
  get(id: string): Promise<Event | null>;
}
