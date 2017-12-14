const path = require("path");
const cron = require("node-cron");
import logger from "../lib/logger";
import { SendEvent } from "../lib/sendEvent";

interface Job {
  id: string;
  schedule: string;
  fn: (sendEvent: SendEvent) => void;
}

let jobs: Job[] = [];

const executeJob = (sendEvent: SendEvent) => (job: Job) => {
  logger.debug("Executing job: %s", job.id || job.fn.name || "unknown");
  job.fn(sendEvent);
};

const scheduleJob = (sendEvent: SendEvent) => (job: Job) => {
  const boundExecuteJob = executeJob(sendEvent);
  cron.schedule(job.schedule, () => boundExecuteJob(job));
  boundExecuteJob(job);
};

export const start = (projectPath: string, sendEvent: SendEvent) => {
  const configPath = path.join(projectPath, "dashbling.config");
  jobs = require(configPath).jobs || [];

  jobs.forEach(scheduleJob(sendEvent));
};
