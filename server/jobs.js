const path = require("path");
const cron = require("node-cron");

let jobs;

const executeJob = sendEvent => job => {
  console.log("Executing job");
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
