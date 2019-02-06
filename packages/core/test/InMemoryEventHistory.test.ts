import { createHistory } from "../src/lib/InMemoryEventHistory";

test("stores latest event per id", async () => {
  const history = await createHistory();

  const myEvent1 = {
    id: "myEvent",
    data: { first: "event" },
    updatedAt: new Date()
  };
  await history.put("myEvent", myEvent1);

  let events = await history.getAll();
  expect(events).toEqual([myEvent1]);

  const myEvent2 = {
    id: "myEvent",
    data: { second: "event" },
    updatedAt: new Date()
  };
  await history.put("myEvent", myEvent2);

  events = await history.getAll();
  expect(events).toEqual([myEvent2]);

  const anotherEvent = { id: "anotherEvent", data: {}, updatedAt: new Date() };
  await history.put("anotherEvent", anotherEvent);

  events = await history.getAll();
  expect(events).toEqual([myEvent2, anotherEvent]);
});

test("get event data by id", async () => {
  const history = await createHistory();

  const myEvent = {
    id: "myEvent",
    data: { first: "event" },
    updatedAt: new Date()
  };

  history.put("myEvent", myEvent);
  const eventFromHistory = await history.get("myEvent");

  expect(eventFromHistory).toEqual(myEvent);
});
