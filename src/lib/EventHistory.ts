import { Event } from "./Event";

export interface EventHistory {
  put(event: Event): void;
  get(): Event[];
}
