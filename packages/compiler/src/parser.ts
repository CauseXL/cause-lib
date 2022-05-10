import { AstNode, Token } from "./types";

/**
 * For our parser we're going to take our array of tokens and turn it into an
 * AST.
 *
 *   [{ type: 'paren', value: '(' }, ...]   =>   { type: 'Program', body: [...] }
 */
export const parser = (tokens: Token[]) => {
  let cur = 0;
  const ast: any = {
    type: "Program",
    body: [],
  };
  while (cur < tokens.length) {
    ast.body.push(walk());
    cur++;
  }
  function walk() {
    let token = tokens[cur];

    if (token.type === "number") {
      cur++;
      return {
        type: "NumberLiteral",
        value: token.value,
      };
    }

    if (token.type === "string") {
      cur++;
      return {
        type: "StringLiteral",
        value: token.value,
      };
    }

    /**
     * { type: 'paren', value: '(' },
     * { type: 'name', value: 'add' },
     * { type: 'number', value: '2' },
     * { type: 'number', value: '4' },
     * { type: 'paren', value: ')' },
     *
     * ========>
     *
     * {
     *  type: 'CallExpression',
     *  name: 'add',
     *  params: [{
     *    type: 'NumberLiteral',
     *    value: '2'
     *  }, {
     *    type: 'CallExpression',
     *    name: 'subtract',
     *    params: [{
     *      type: 'NumberLiteral',
     *      value: '4'
     *    }, {
     *      type: 'NumberLiteral',
     *      value: '2'
     *    }]
     *  }]
     * }
     */
    if (token.type === "paren" && token.value === "(") {
      // skip this ( token
      token = tokens[++cur];
      const node: AstNode = {
        type: "CallExpression",
        name: token.value,
        params: [],
      };

      // increment `cur` *again* to skip the name token.
      token = tokens[++cur];

      while (
        token.type !== "paren" ||
        (token.type === "paren" && token.value !== ")")
      ) {
        node.params!.push(walk());
        token = tokens[cur];
      }

      // skip ')' token
      cur++;

      return node;
    }
    throw new TypeError(token.type);
  }
  return ast;
};
