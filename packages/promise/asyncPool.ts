export const asyncPool = async<T>(data: T[], limit: number, callBack: Function) => {
  const q = [];
  const executing: Promise<T>[] = [];
  for(const item of data) {
    const p = Promise.resolve().then(() => callBack(item, data));
    q.push(p);

    if (limit <= data.length) {
      const e: any = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= limit) {
        await Promise.race(executing)
      }
    }
  }
  /**
   * [
   *  Promise { 1000 }, 
   *  Promise { 5000 },
   *  Promise { 3000 },
   *  Promise { <pending> }
   * ]
   */
  console.log('==', q)
  return Promise.all(q)
}

export const asyncPool2 = async<T>(data: T[], limit: number, callBack: Function) => {
  const q = [];
  const executing = new Set();
  for(const item of data) {
    const p = Promise.resolve().then(() => callBack(item, data));
    q.push(p);
    executing.add(p);
    const clean = () => executing.delete(p);
    p.then(clean).catch(clean);
    if (executing.size >= limit) {
      await Promise.race(executing)
    }
  }
  return Promise.all(q)
}

// * -------------------------------- test

const timeout = (i: number) => new Promise(resolve => setTimeout(() => {
  resolve(i);
  console.log(`${i} done`)
}, i)); 
await asyncPool([1000, 5000, 3000, 2000], 2, timeout); 
