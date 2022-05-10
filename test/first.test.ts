import { describe, expect, it } from 'vitest';

describe('test vitest', () => {
  it('should work', () => {
    expect(11 + 99).toMatchInlineSnapshot('110');
  })
});
