import { AGENTS } from "./agents";
import type { Agent, Command } from "./agents";
import { exclude } from "./utils";

export function getCommand(agent: Agent, command: Command, args: string[] = []) {
  const c = AGENTS[agent][command];
  if (typeof c === 'function') {
    return c(args);
  }
  if (!c) throw new Error(`Command ${command} is not support by ${agent}`);
  return c.replace(/\{0\}/g, args.join(' '));
}

export const parseNi = (agent: Agent, args: string[]) => {
  if (args.includes('-g')) {
    return getCommand(agent, 'global', exclude(args, '-g'));
  }

  if (args.includes('--frozen')) {
    return getCommand(agent, "frozen", exclude(args, "-frozen"));
  }

  return getCommand(agent, 'add', args);
}

export const parseNr = (agent: Agent, args: string[]) => {
  if (args.length === 0) {
    args.push('start');
  }

  return getCommand(agent, "run", args);
};
