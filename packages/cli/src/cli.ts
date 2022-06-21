import meow from "meow";
import type { Result, AnyFlags, TypedFlags } from "meow";
import inquirer from "inquirer";
import path from "path";
import { constants } from "fs";
import { access } from "fs/promises";
import chalk from "chalk";
import ncp from "ncp";

const defaultTemplate = "TypeScript";

export const getArgs = meow(
  `
	Usage
	  $ cause-cli <input>

	Options
	  --template, -t  Choose a template

	Examples
	  $ cause-cli test --template
	  🌈 unicorns 🌈
`,
  {
    importMeta: import.meta,
    flags: {
      template: {
        type: "string",
        alias: "t",
      },
    },
  }
);

export const promptOptions = async (flags: TypedFlags<AnyFlags>) => {
  const questions = [];
  const { template, git } = flags ?? {}
  if (!template) {
    questions.push({
      type: "list",
      name: "template",
      message: "Please choose which project template to use",
      choices: ["JavaScript", "TypeScript"],
      default: defaultTemplate,
    });
  }
  if (!git) {
    questions.push({
      type: "confirm",
      name: "git",
      message: "Initialize a git repository?",
      default: false,
    });
  }
  const answers = await inquirer.prompt(questions);
  return {
    ...flags,
    template: template || answers.template,
    git: git || answers.git,
  }
};

const createProject = async (options: any) => {
  // * file:///Users/xlcause/Desktop/learn/cause-lib/packages/cli/dist/cli.mjs
  const curUrl = import.meta.url;
  // * /Users/xlcause/Desktop/learn/cause-lib/packages/cli/templates
  const templateDir = path.resolve(
    new URL(curUrl).pathname,
    "../../templates",
    options.template.toLowerCase()
  );
  console.log("templateDir======", templateDir);
  try {
    await access(templateDir, constants.F_OK);
    console.log("%s template accessed", chalk.white.bgGreen.bold("SUCCESS"));
  } catch {
    console.error(
      "%s cannot access templates",
      chalk.white.bgRed.bold("ERROR")
    );
    process.exit(1);
  }

  console.log("===== debug process.cwd ======", process.cwd());

  ncp(templateDir, process.cwd(), (err) => {
    if (err) {
      console.error("%s copy template failed", chalk.white.bgRed.bold("ERROR"));
      process.exit(1);
    }
    console.log("%s copy template success", chalk.white.bgGreen.bold("DONE"));
  });
};

export const cli = async (options: Result<AnyFlags>) => {
  const { input, flags } = options;
  const finalOptions = await promptOptions(flags);
  console.log(finalOptions);
  await createProject(finalOptions);
};

