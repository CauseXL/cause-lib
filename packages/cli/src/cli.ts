import chalk from "chalk";
import type { Result, AnyFlags } from "meow";
import { promptOptions } from "./questions";
import { createTasks } from "./tasks";
import { getTemplateDir } from "./util";

export const cli = async (options: Result<AnyFlags>) => {
  const { input, flags } = options;
  let finalOptions = await promptOptions(flags);
  const templateDir = await getTemplateDir(finalOptions);
  finalOptions = { ...finalOptions, templateDir };
  console.log(chalk.white.bgMagenta.bold("YOUR CONFIGS:"), finalOptions);
  const tasks = createTasks(finalOptions);
  await tasks.run();
  console.log("%s Project ready", chalk.white.bgGreen.bold("DONE"));
};
