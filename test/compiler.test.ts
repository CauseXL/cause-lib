import { describe, expect, it } from "vitest";
import { compiler, parser, tokenizer, transformer } from "@cause_xl/compiler";

const TEST_LSP = "(add 2 (subtract 4 2))";
const TEST_LSP_TOKENS = tokenizer(TEST_LSP);
const TEST_LSP_AST = parser(TEST_LSP_TOKENS);

describe("test tokenizer", () => {
  it("should works", () => {
    expect(tokenizer(TEST_LSP)).toMatchInlineSnapshot(`
      [
        {
          "type": "paren",
          "value": "(",
        },
        {
          "type": "name",
          "value": "add",
        },
        {
          "type": "number",
          "value": "2",
        },
        {
          "type": "paren",
          "value": "(",
        },
        {
          "type": "name",
          "value": "subtract",
        },
        {
          "type": "number",
          "value": "4",
        },
        {
          "type": "number",
          "value": "2",
        },
        {
          "type": "paren",
          "value": ")",
        },
        {
          "type": "paren",
          "value": ")",
        },
      ]
    `);
  });
});

describe("test parser", () => {
  it("should works", () => {
    expect(parser(TEST_LSP_TOKENS)).toMatchInlineSnapshot(`
      {
        "body": [
          {
            "name": "add",
            "params": [
              {
                "type": "NumberLiteral",
                "value": "2",
              },
              {
                "name": "subtract",
                "params": [
                  {
                    "type": "NumberLiteral",
                    "value": "4",
                  },
                  {
                    "type": "NumberLiteral",
                    "value": "2",
                  },
                ],
                "type": "CallExpression",
              },
            ],
            "type": "CallExpression",
          },
        ],
        "type": "Program",
      }
    `);
  });
});

describe("test transformer", () => {
  it("should works", () => {
    expect(transformer(TEST_LSP_AST)).toMatchInlineSnapshot(`
      {
        "body": [
          {
            "expression": {
              "arguments": [
                {
                  "type": "NumberLiteral",
                  "value": "2",
                },
                {
                  "arguments": [
                    {
                      "type": "NumberLiteral",
                      "value": "4",
                    },
                    {
                      "type": "NumberLiteral",
                      "value": "2",
                    },
                  ],
                  "callee": {
                    "name": "subtract",
                    "type": "Identifier",
                  },
                  "type": "CallExpression",
                },
              ],
              "callee": {
                "name": "add",
                "type": "Identifier",
              },
              "type": "CallExpression",
            },
            "type": "ExpressionStatement",
          },
        ],
        "type": "Program",
      }
    `);
  });
});

describe("test compiler", () => {
  it("should works", () => {
    expect(compiler(TEST_LSP)).toMatchInlineSnapshot(
      '"add(2, subtract(4, 2));"'
    );
  });
});
