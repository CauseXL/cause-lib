import { describe, expect, it } from 'vitest'
import { getExports } from '../src';

describe('should', () => {
  it('ESM exported', async () => {
    const res = await (await getExports('@antfu/utils')).slice(0, 5)
    expect(res).toMatchInlineSnapshot(`
      [
        "assert",
        "at",
        "batchInvoke",
        "clamp",
        "clampArrayRange",
      ]
    `);
  })
  
  it('CJS exported', async () => {
    const res = await (await getExports('axios')).slice(0, 5)
    expect(res).toMatchInlineSnapshot(`
      [
        "request",
        "getUri",
        "delete",
        "get",
        "head",
      ]
    `);
  });
})
