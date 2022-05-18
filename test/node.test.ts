import path from "path";
import { describe, expect, it } from "vitest";

describe("test nr", async () => {
  it("should work", () => {
    expect(module).toMatchInlineSnapshot(`
      {
        "exports": {
          Symbol(Symbol.toStringTag): "Module",
        },
      }
    `);

    expect(path.resolve('/foo/bar', 'tmp/file/')).toMatchInlineSnapshot('"/foo/bar/tmp/file"');
  });
});
