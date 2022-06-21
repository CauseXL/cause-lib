import path from "path";
import { constants } from "fs";
import { access } from "fs/promises";
import chalk from "chalk";
import { Options } from "./types";

export const getTemplateDir = async (options: Options): Promise<string> => {
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
  return templateDir;
};
