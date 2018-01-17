import { EventHistory } from "../src/lib/EventHistory";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as util from "util";

export const mockDate = (date: Date) => {
  const originalNow = Date.now;
  const mockedDateFn = () => date.getTime();
  (mockedDateFn as any).restore = () => (Date.now = originalNow);

  Date.now = mockedDateFn;
};

export const restoreDate = () => {
  (Date.now as any).restore();
};

export const mkTempDir = async () => {
  const mkdtemp = util.promisify(fs.mkdtemp);
  return await mkdtemp(path.join(os.tmpdir(), "dashbling-tests-"));
};

export const mkTempFile = async (filename: string) => {
  const writeFile = util.promisify(fs.writeFile);

  const tmpDir = await mkTempDir();
  const pathToFile = path.join(tmpDir, filename);
  await writeFile(pathToFile, "");

  return pathToFile;
};
