import { describe, expect, it } from "vitest";
import {
  binarySearch,
  normalBinarySearch,
  reverseString,
} from "../../packages/algorithm";

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

describe("test binarySearch dfs", async () => {
  it("should work", () => {
    expect(reverseString("abcd")).toMatchInlineSnapshot('"dcba"');
  });
});

describe("test binarySearch dfs", async () => {
  it("should work", () => {
    expect(binarySearch(arr, 4)).toMatchInlineSnapshot("3");
    expect(binarySearch(arr, 11)).toMatchInlineSnapshot("-1");
  });
});

describe("test normalBinarySearch dfs", async () => {
  it("should work", () => {
    expect(normalBinarySearch(arr, 4)).toMatchInlineSnapshot("3");
    expect(normalBinarySearch(arr, 11)).toMatchInlineSnapshot('-1');
  });
});
