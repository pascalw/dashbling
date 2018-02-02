const path = require("path");
const cron = require("node-cron");
import logger from "../lib/logger";
import { SendEvent } from "../lib/sendEvent";
import { ClientConfig } from "./clientConfig";

interface Job {
  id?: string;
  schedule: string;
  fn: (sendEvent: SendEvent) => void;
}

let jobs: Job[] = [];

const executeJob = (sendEvent: SendEvent) => async (job: Job) => {
  const jobId = job.id || job.fn.name || "unknown";
  logger.debug("Executing job: %s", jobId);

  try {
    await job.fn(sendEvent);
  } catch (e) {
    console.warn(`Failed to execute job ${jobId}: ${e}`);
  }
};

const scheduleJob = (sendEvent: SendEvent) => (job: Job) => {
  const boundExecuteJob = executeJob(sendEvent);
  cron.schedule(job.schedule, () => boundExecuteJob(job));
  boundExecuteJob(job);
};

export const start = (clientConfig: ClientConfig, sendEvent: SendEvent) => {
  clientConfig.jobs.forEach(scheduleJob(sendEvent));
};
