/**
 * So now we have our AST, and we want to be able to visit different nodes with
 * a visitor. We need to be able to call the methods on the visitor whenever we
 * encounter a node with a matching type.
 *
 *   traverse(ast, {
 *     Program: {
 *       enter(node, parent) {
 *         // ...
 *       },
 *       exit(node, parent) {
 *         // ...
 *       },
 *     },
 *
 *     CallExpression: {
 *       enter(node, parent) {
 *         // ...
 *       },
 *       exit(node, parent) {
 *         // ...
 *       },
 *     },
 *
 *     NumberLiteral: {
 *       enter(node, parent) {
 *         // ...
 *       },
 *       exit(node, parent) {
 *         // ...
 *       },
 *     },
 *   });
 */

import { AstNode } from "./types";

export const traverser = (ast: any, visitor: any) => {
  function traverseArray(arr: any[] | undefined, parent: AstNode) {
    arr?.forEach((child) => {
      traverseNode(child, parent);
    });
  }

  function traverseNode(node: AstNode, parent: AstNode | null) {
    const method = visitor[node.type];
    if (method?.enter) method.enter(node, parent);

    switch (node.type) {
      case "Program":
        traverseArray(node.body, node);
        break;
      case "CallExpression":
        traverseArray(node.params, node);
        break;
      case "NumberLiteral":
      case "StringLiteral":
        break;
      default:
        throw new TypeError(node.type);
    }

    if (method?.exit) method.exit(node, parent);
  }
  traverseNode(ast, null);
};
