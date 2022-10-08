export const compose = <T>(...fns: Function[]) => {
  return (x: T) => {
    return fns.reduceRight((acc, curFn) => {
      return curFn(acc)
    }, x)
  }
}
