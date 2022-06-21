### import.meta

``` js
expect(import.meta).toMatchInlineSnapshot(
`{
  "url": "file:///Users/xlcause/Desktop/learn/cause-lib/test/node.test.ts",
  }`
);
```

### new URL

- https://developer.mozilla.org/zh-CN/docs/Web/API/URL/URL

``` js
expect(new URL(import.meta.url).pathname).toMatchInlineSnapshot(
  '"/Users/xlcause/Desktop/learn/cause-lib/test/node.test.ts"'
);
```

### path

``` js
// * 给定的路径序列从右到左处理，每个后续的 path 会被追加到前面，直到构建绝对路径
describe("test path", async () => {
  it("should work", () => {
    expect(path.resolve("/foo", "/bar")).toMatchInlineSnapshot('"/bar"');
    expect(path.resolve("/foo", "../bar")).toMatchInlineSnapshot('"/bar"');
    expect(path.resolve("/foo", "./bar")).toMatchInlineSnapshot('"/foo/bar"');
    expect(path.resolve("/foo", "bar")).toMatchInlineSnapshot('"/foo/bar"');
    // * 如果在处理完所有给定的 path 片段之后，还没有生成绝对路径，则使用当前工作目录
    expect(path.resolve("foo", "bar")).toMatchInlineSnapshot('"/Users/xlcause/Desktop/learn/cause-lib/foo/bar"');
  });
});
```
