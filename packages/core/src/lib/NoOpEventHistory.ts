import { EventHistory } from "./EventHistory";
import { Event } from "./Event";

class NoOpEventHistory implements EventHistory {
  async put(event: Event) {}

  get(): Event[] {
    return [];
  }
}

export const createHistory = async (): Promise<EventHistory> => {
  return new NoOpEventHistory();
};
