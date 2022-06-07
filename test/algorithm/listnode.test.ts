import { describe, it, expect } from "vitest";
import {
  insertHead,
  removeHead,
  insertTail,
  ListNode,
  StackNode,
  removeTail,
} from "../../packages/algorithm";

const first = new ListNode(1);
const second = new ListNode(2);
const third = new ListNode(3);

first.next = second;
second.next = third;

describe("test list node", async () => {
  it("should work", () => {
    expect(insertHead(new ListNode(4), first)).toMatchInlineSnapshot(`
      ListNode {
        "item": 4,
        "next": ListNode {
          "item": 1,
          "next": ListNode {
            "item": 2,
            "next": ListNode {
              "item": 3,
              "next": null,
            },
          },
        },
      }
    `);

    expect(removeHead(first)).toMatchInlineSnapshot(`
      ListNode {
        "item": 2,
        "next": ListNode {
          "item": 3,
          "next": null,
        },
      }
    `);

    expect(insertTail(new ListNode(5), first)).toMatchInlineSnapshot(`
      ListNode {
        "item": 1,
        "next": ListNode {
          "item": 2,
          "next": ListNode {
            "item": 3,
            "next": ListNode {
              "item": 5,
              "next": null,
            },
          },
        },
      }
    `);

    expect(removeTail(first)).toMatchInlineSnapshot(`
      ListNode {
        "item": 1,
        "next": ListNode {
          "item": 2,
          "next": ListNode {
            "item": 3,
            "next": null,
          },
        },
      }
    `);

    expect(first).toMatchInlineSnapshot(`
      ListNode {
        "item": 1,
        "next": ListNode {
          "item": 2,
          "next": ListNode {
            "item": 3,
            "next": null,
          },
        },
      }
    `);
  });
});

const stack = new StackNode();

describe("test Stack", async () => {
  it("should work", () => {
    expect(stack).toMatchInlineSnapshot('StackNode {}');
  });

  it("should work", () => {
    stack.push(12);
    expect(stack.getSize()).toMatchInlineSnapshot("1");
  });

  it("should work", () => {
    stack.push("12");
    expect(stack.getSize()).toMatchInlineSnapshot("2");
  });

  it("should work", () => {
    stack.push({});
    expect(stack.getSize()).toMatchInlineSnapshot("3");
  });

  it("should work", () => {
    const peek = stack.pop();
    expect(peek).toMatchInlineSnapshot("{}");
  });

  it("should work", () => {
    expect(stack.getFirst()).toMatchInlineSnapshot(`
      ListNode {
        "item": "12",
        "next": ListNode {
          "item": 12,
          "next": null,
        },
      }
    `);
  });

  it("should work", () => {
    while (stack.getSize() > 0) {
      stack.pop();
    }
    expect(stack.isEmpty()).toMatchInlineSnapshot("true");
    expect(stack.getFirst()).toMatchInlineSnapshot('null');
  });
});
