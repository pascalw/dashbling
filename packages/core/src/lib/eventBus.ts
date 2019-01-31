import { EventHistory } from "./EventHistory";
import { Event } from "./Event";

export interface Subscriber {
  (event: Event): void;
}

export interface Reducer {
  (eventId: string, previousState: any | null, eventData: any): any;
}

export const defaultReducer: Reducer = (
  _id: string,
  _oldState: any | null,
  event: any
): any => {
  return event;
};

export class EventBus {
  private subscribers: Subscriber[];
  private history: EventHistory;
  private reducer: Reducer;

  static withDefaultReducer(history: EventHistory) {
    return new EventBus(history, defaultReducer);
  }

  constructor(history: EventHistory, reducer: Reducer) {
    this.subscribers = [];
    this.history = history;
    this.reducer = reducer;
  }

  subscribe(subscriber: Subscriber) {
    this.subscribers.push(subscriber);
  }

  unsubscribe(subscriber: Subscriber) {
    const idx = this.subscribers.indexOf(subscriber);
    this.subscribers.splice(idx, 1);
  }

  async publish(id: string, data: any) {
    const previousState = await this.history.get(id);
    const previousData = previousState == null ? null : previousState.data;

    const reducedData = this.reducer(id, previousData, data);
    const event: Event = {
      id,
      data: reducedData,
      updatedAt: new Date(Date.now())
    };

    this.subscribers.forEach(subscriber => subscriber(event));
    return this.history.put(id, event);
  }

  async replayHistory(subscriber: Subscriber) {
    const events = await this.history.getAll();
    events.forEach(event => subscriber(event));
  }
}
