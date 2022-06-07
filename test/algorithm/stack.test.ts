import { describe, expect, it } from "vitest";
import {
  calExpression,
  calExpression2,
  isRightBracket,
  Stack,
} from "../../packages/algorithm";

const testExp = '(1 + ((2 + 3) * (7 * 5)))';
const testExp2 = "[()]{}{[()()]()}";
const testExp3 = '1 + 2 ) * 3 - 4 ) * 5 - 6 ) ) )'
const stack = new Stack()
const test = () => {
  throw new Error("test sad");
};


describe("test Expression calculation", async () => {
  it("should work", () => {
    expect(calExpression(testExp)).toMatchInlineSnapshot("176");
  });
  it("should work", () => {
    expect(isRightBracket(testExp2)).toMatchInlineSnapshot("true");
  });
  it("should work", () => {
    expect(calExpression2(testExp3)).toMatchInlineSnapshot('"((1 + 2) * ((3 - 4) * (5 - 6)))"');
  });
});

describe("test Stack", async () => {
  it("should work", () => {
    expect(stack).toMatchInlineSnapshot(`
      Stack {
        "MAX": 1,
      }
    `);
  });

  it("should work", () => {
    stack.push(12);
    expect(stack.getSize()).toMatchInlineSnapshot('1');
    expect(stack.MAX).toMatchInlineSnapshot("1");
  });

  it("should work", () => {
    stack.push('12');
    expect(stack.getSize()).toMatchInlineSnapshot('2');
    expect(stack.MAX).toMatchInlineSnapshot('2');
  });

  it("should work", () => {
    stack.push({});
    expect(stack.getSize()).toMatchInlineSnapshot('3');
    expect(stack.MAX).toMatchInlineSnapshot('4');
  });

  it("should work", () => {
    const peek = stack.pop();
    expect(peek).toMatchInlineSnapshot('{}');
  });

  it("should work", () => {
    while (stack.getSize() > 0) {
      stack.pop();
    }
    stack.pop();
    stack.pop();
    expect(stack.isEmpty()).toMatchInlineSnapshot('true');
    expect(stack.getSize()).toMatchInlineSnapshot('0');
  });

  it("should work", () => {
    expect(() => test()).toThrowError('test');
  });
});
