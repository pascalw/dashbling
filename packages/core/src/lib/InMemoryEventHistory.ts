import { EventHistory } from "./EventHistory";
import { Event } from "./Event";

class InMemoryEventHistory implements EventHistory {
  private history: { [key: string]: Event } = {};

  async put(id: string, event: Event) {
    this.history[id] = event;
  }

  async get(id: string) {
    return this.history[id];
  }

  async getAll(): Promise<Event[]> {
    return Object.values(this.history);
  }
}

export const createHistory = async (): Promise<EventHistory> => {
  return new InMemoryEventHistory();
};
