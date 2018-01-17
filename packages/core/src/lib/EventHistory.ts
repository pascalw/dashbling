import { Event } from "./Event";

export interface EventHistory {
  put(id: string, event: Event): void;
  get(): Event[];
}
