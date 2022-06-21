import meow from "meow";
import type { AnyFlags, TypedFlags } from "meow";
import inquirer from "inquirer";
import { Options } from "./types";

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

export const promptOptions = async (flags: TypedFlags<AnyFlags>): Promise<Options> => {
  const questions = [];
  const { template, git } = flags ?? {};
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
    targetDirectory: process.cwd(),
    templateDir: '',
  };
};
