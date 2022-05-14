import { findUp } from "find-up";
import path from "path";
import { LOCKS } from "./agents";

export const detect = async (cwd = process.cwd()) => {
  const lockPath = await findUp(Object.keys(LOCKS), { cwd }) || '';
  return LOCKS[path.basename(lockPath)];
};
