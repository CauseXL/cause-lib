const obj = {
  a: {
    aa: 1
  },
  b: 11,
  c: 111,
}

const listener = []

const makeProxy = (obj) => {
  const handle = {
    get: (target, key) => {
      console.log('key', key);
      listener.push(key);
      return target[key];
    },
    set: (target, key, value) => {
      console.log('key', key)
      listener.forEach(l => {
        if (l === key) {
          console.log('trigger', l)
        }
      })
      listener.splice(listener.indexOf(key), 1);
      target[key] = value;
      return value;
    }
  }
  return new Proxy(obj, handle)
}

const pObj = makeProxy(obj);

pObj.aa;

console.log(listener)

pObj.a.aa = 2;

console.log(listener)
// console.log(obj.a)
console.log(pObj.a)
// console.log(Reflect.get(pObj, 'a'))
// console.log(Reflect.get(obj, 'a'))
console.log(listener)

pObj.a = 12
console.log(pObj.a)
