###

``` js
const proxyObj = (obj) => {
  const res = {};
  for (const key in obj) {
    res[key] = {
      base_: obj[key],
      copy_: JSON.parse(JSON.stringify(obj[key])),
    }
  }
  return res;
}
```

也就是说，本来的值存为 base_, 保留一份对原始对象的深拷贝（并不准确，只是为了大家理解），记作 copy_。同时会维护一个 proxy 对象，这个 proxy 对象就是 recipe 函数的 draft 对象。

当我们对对象进行修改，Immer 会把这个修改代理到 copy_ 上面。最后再把 copy_ 返回（并不准确，只是为了大家理解）。

有一点值得注意，在返回最终结果的时候并不是简单的返回 copy_ 对象，如果当前值没有被修改，那就返回 base_ 对应的值。

我们可以把对象想象成一棵树，当某一个孩子节点被修改了，它及其它的 parent 节点都会被标记为被修改，此时返回 copy_ 对象上的值；而除去这个链路上的节点（它的 sibling 节点，它 parent 的 sibling 节点）都直接返回 base_ 对象上的值。

### produce

``` js
produce = (base, recipe) => {
  let result;

  // 判断传入的值是不是合法的对象
  if (isDraftable(base)) {
    // 创建一个上下文，后面根据上下文可以还原出值
    const scope = enterScope(this);
    // 对 base 对象创建代理，以便劫持所有的修改
    const proxy = createProxy(this, base, undefined)
    // 调用修改函数，我们 recipe 可能只操作 proxy，不返回值
    result = recipe(proxy)
    // 合并出最终的结果，返回
    return processResult(result, scope)
  }
}
```



