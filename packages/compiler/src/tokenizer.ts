import { Token } from "./types";

/**
 * (add 2 (subtract 4 2)) => 
 * [{ type: 'paren', value: '(' }, ...]
 */
const tokenizer = (input: string): Token[] => {
  let cur = 0;
  const tokens: Token[] = [];
  while (cur < input.length) {
    let char = input[cur];
    if (char === "(") {
      tokens.push({
        type: "paren",
        value: "(",
      });
      cur++;
      continue;
    }
    if (char === ")") {
      tokens.push({
        type: "paren",
        value: ")",
      });
      cur++;
      continue;
    }

    const WHITE_SPACES = /\s/;
    if (WHITE_SPACES.test(char)) {
      cur++;
      continue;
    }

    const NUMBERS = /[0-9]/;
    if (NUMBERS.test(char)) {
      let value = "";
      while (NUMBERS.test(char)) {
        value += char;
        char = input[++cur];
      }
      tokens.push({
        type: "number",
        value,
      });
      continue;
    }

    if (char === '"') {
      let value = "";
      // skip the first quote
      char = input[++cur];
      while (char !== '"') {
        value += char;
        char = input[++cur];
      }
      // skip the last quote
      char = input[++cur];
      tokens.push({
        type: "string",
        value,
      });
      continue;
    }

    const LETTERS = /[a-z]/i;
    if (LETTERS.test(char)) {
      let value = "";
      while (LETTERS.test(char)) {
        value += char;
        char = input[++cur];
      }
      tokens.push({
        type: "name",
        value,
      });
      continue;
    }

    throw new TypeError(`Unexpected token ${char}`);
  }
  return tokens;
};

export { tokenizer };
