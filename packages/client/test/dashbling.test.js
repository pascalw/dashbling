import * as dashbling from "../dashbling";
import { heartbeat } from "../../core/src/lib/constants.ts";
import { dashblingConnected, eventReceived } from "../store";

const storeMock = () => {
  const store = jest.fn();
  store.dispatch = jest.fn();
  return store;
};

test("dispatches connected message when event source is opened", () => {
  const store = storeMock();
  const eventSource = jest.fn();

  dashbling.connectStoreToDashbling(store, eventSource);
  eventSource.onopen();

  expect(store.dispatch).toHaveBeenCalledWith(dashblingConnected(true));
});

test("dispatches disconnected message on error", () => {
  const store = storeMock();
  const eventSource = jest.fn();

  dashbling.connectStoreToDashbling(store, eventSource);
  eventSource.onerror();

  expect(store.dispatch).toHaveBeenCalledWith(dashblingConnected(false));
});

test("dispatches received messages", () => {
  const store = storeMock();
  const eventSource = jest.fn();

  dashbling.connectStoreToDashbling(store, eventSource);

  const updatedAt = Date.now();
  const event = {
    data: JSON.stringify({
      id: "myEvent",
      data: { some: "arg" },
      updatedAt: updatedAt
    })
  };
  eventSource.onmessage(event);

  expect(store.dispatch).toHaveBeenCalledWith(
    eventReceived("myEvent", { some: "arg" }, updatedAt)
  );
});

test("ignores heartbeat messages", () => {
  const store = storeMock();
  const eventSource = jest.fn();

  dashbling.connectStoreToDashbling(store, eventSource);

  const event = { data: heartbeat };
  eventSource.onmessage(event);

  expect(store.dispatch).not.toHaveBeenCalled();
});
