import { createHistory } from "../src/lib/FileEventHistory";
import { mkTempFile, mkTempDir } from "./utils";

import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";

test("stores latest event per id", async () => {
  const historyPath = await mkTempFile("history");
  const history = await createHistory(historyPath);

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
  const historyPath = await mkTempFile("history");
  const history = await createHistory(historyPath);

  const myEvent = {
    id: "myEvent",
    data: { first: "event" },
    updatedAt: new Date()
  };

  await history.put("myEvent", myEvent);
  const eventFromHistory = await history.get("myEvent");

  expect(eventFromHistory).toEqual(myEvent);
});

test("writes events to file", async () => {
  const historyPath = await mkTempFile("history");
  const history = await createHistory(historyPath);

  const myEvent1 = {
    id: "myEvent",
    data: { first: "event" },
    updatedAt: new Date()
  };
  await history.put("myEvent", myEvent1);

  const contents = await promisify(fs.readFile)(historyPath);
  expect(contents.toString()).toEqual(JSON.stringify([myEvent1]));
});

test("reads initial history from file", async () => {
  const historyPath = await mkTempFile("history");
  const history1 = await createHistory(historyPath);

  const myEvent1 = {
    id: "myEvent",
    data: { first: "event" },
    updatedAt: new Date()
  };
  await history1.put("myEvent", myEvent1);

  const history2 = await createHistory(historyPath);
  let events = await history2.getAll();

  expect(events).toEqual([myEvent1]);
});

test("creates history file if it doesnt exist", async () => {
  const tmpDir = await mkTempDir();
  const historyPath = path.join(tmpDir, "doesntexist");
  const _ = await createHistory(historyPath);

  expect(fs.accessSync(historyPath)).toBeTruthy;
});
