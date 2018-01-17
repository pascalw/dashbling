import { EventHistory } from "./EventHistory";
import { Event } from "./Event";

class InMemoryEventHistory implements EventHistory {
  private history: { [key: string]: Event } = {};

  async put(event: Event) {
    this.history[event.id] = event;
  }

  get(): Event[] {
    return Object.values(this.history);
  }
}

export const createHistory = async (): Promise<EventHistory> => {
  return new InMemoryEventHistory();
};
