export const tokenTypes = ["paren", "number", "name", "string"] as const;

export type TokenTypes = typeof tokenTypes[number];

export interface Token {
  type: TokenTypes;
  value: string;
}

export interface AstNode {
  type: string;
  value?: string;
  name?: string;
  params?: AstNode[];
  body?: any[];
  _context?: any;
}
