import { execaCommand } from "execa";
import { Agent } from "./agents";
import { detect } from "./detect";
import { exclude } from "./utils";

const DEBUG_SIGN = '?';

type Runner = (agent: Agent, args: string[]) => Promise<string> | string

export const runCli = async(fn: Runner) => {
  const args = process.argv.slice(2);
  console.log(args);
  try {
    await run(fn, args);
  } catch(e) {
    process.exit(1);
  }
}

const run = async (fn: Runner, args: string[]) => {
  const isDebug = args.includes(DEBUG_SIGN);
  const cwd = process.cwd();
  let command;
  if (isDebug) {
    args = exclude(args, DEBUG_SIGN);
    console.log('args from debug', args);
  }
  let agent = (await detect()) || "npm";
  command = await fn(agent, args);
  if (!command) return;
  if (isDebug) {
    console.log('command from debug', command);
    return;
  }
  await execaCommand(command, { stdio: 'inherit', encoding: 'utf-8', cwd });
}
