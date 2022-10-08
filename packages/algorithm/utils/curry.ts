export const curry = (fn: Function) => {
  return function curried(...args: unknown[]) {
    if (args.length >= fn.length) {
      return fn.apply(null, args);
    } else {
      return (...arg2: unknown[]) => {
        return curried.apply(null, args.concat(arg2));
      }
    }
  }
}


// function sum(a, b, c) {
//   return a + b + c;
// }

// let curriedSum = curry(sum);

// console.log(curriedSum(1,2,3))

