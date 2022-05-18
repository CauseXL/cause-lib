import { describe, expect, it } from 'vitest';
import { LOCKS, parseNi, parseNr } from '@cause_xl/ni';
import { findUp } from 'find-up';
import fg from 'fast-glob';
import path from 'path';

describe('test ni', () => {
  it('pnpm', () => {
    expect(parseNi('pnpm', ['eslint', '@types/node'])).toMatchInlineSnapshot(
      '"pnpm add eslint @types/node"');
  })
  
  it("yarn", () => {
    expect(parseNi("yarn", ["-g", "-D"])).toMatchInlineSnapshot(
      '"yarn global add -D"'
    );
  });
});

describe('test nr', () => {
  it('pnpm run', () => {
    expect(parseNr('pnpm', [])).toMatchInlineSnapshot(
      '"pnpm run start"');
  })

  it("yarn run", () => {
    expect(parseNr("yarn", ["start", "dev"])).toMatchInlineSnapshot(
      '"yarn run start dev"'
    );
  });
});

describe("test nr", async () => {
  const lockPath = await findUp(Object.keys(LOCKS), { cwd: process.cwd() }) || ''
  it("pnpm run", async () => {
    expect(fg.sync("packages/ni/src/command/*.ts").map((i) => i.slice(0, -3)))
      .toMatchInlineSnapshot(`
        [
          "packages/ni/src/command/index",
          "packages/ni/src/command/ni",
          "packages/ni/src/command/nr",
        ]
      `);
    expect(path.basename(lockPath)).toMatchInlineSnapshot('"pnpm-lock.yaml"');;
  });
});
