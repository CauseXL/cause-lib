import { tokenizer } from "./tokenizer";
import { parser } from "./parser";
import { transformer } from "./transformer";
import { codeGenerator } from "./generator";

export const compiler = (input: string): string => {
  const tokens = tokenizer(input);
  const ast = parser(tokens);
  const transformedAst = transformer(ast);
  const output = codeGenerator(transformedAst);
  return output;
};
