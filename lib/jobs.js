const path = require("path");
const cron = require("node-cron");
const logger = require("../lib/logger");

let jobs;

const executeJob = sendEvent => job => {
  logger.debug("Executing job: %s", job.id || job.fn.name || "unknown");
  job.fn(sendEvent);
};

const scheduleJob = sendEvent => job => {
  const boundExecuteJob = executeJob(sendEvent);
  cron.schedule(job.schedule, () => boundExecuteJob(job));
  boundExecuteJob(job);
};

module.exports.start = (projectPath, sendEvent) => {
  const jobsPath = path.join(projectPath, "jobs");
  jobs = require(jobsPath);

  jobs.forEach(scheduleJob(sendEvent));
};
