import * as jobs from "../src/lib/jobs";
import { parse as parseConfig } from "../src/lib/clientConfig";

const basicValidClientConfig = parseConfig(
  {
    jobs: [],
    eventHistory: Promise.resolve()
  },
  "/fake"
);

test("catches job errors", async () => {
  const throwingJob = {
    schedule: "59 22 11 11 *",
    fn: async () => {
      throw "boom";
    }
  };

  const clientConfig = {
    ...basicValidClientConfig,
    jobs: [throwingJob]
  };

  const sendEvent = jest.fn();

  expect(() => {
    jobs.start(clientConfig, sendEvent);
  }).not.toThrow();
});
