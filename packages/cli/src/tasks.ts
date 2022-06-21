import chalk from "chalk";
import ncp from "ncp";
import { execa } from "execa";
import Listr from "listr";

const initGit = async () => {
  try {
    await execa("git", ["init"]);
    console.log("%s git init success", chalk.white.bgGreen.bold("DONE"));
  } catch (e) {
    console.error("%s git init failed", chalk.white.bgRed.bold("ERROR"));
    process.exit(1);
  }
};

const copyTemplate = async (options: any) => {
  const { templateDir, targetDirectory } = options;
  return ncp(templateDir, targetDirectory, (err) => {
    if (err) {
      console.error("%s copy template failed", chalk.white.bgRed.bold("ERROR"));
      process.exit(1);
    }
    console.log("%s copy template success", chalk.white.bgGreen.bold("DONE"));
  });
};

export const createTasks = (options: any) => {
  return new Listr([
    {
      title: "Copy template",
      task: () => copyTemplate(options),
    },
    {
      title: "Init git",
      task: () => initGit(),
      enabled: () => options.git,
    },
  ]);
};


