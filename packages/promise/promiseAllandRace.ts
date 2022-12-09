export const myPromiseAll = (tasks: Promise<any>[]) => {
  return new Promise<any>((resolve, reject) => {
    const result: any = [];
    let count = 0;
    for (let i = 0; i < tasks.length; i++) {
      Promise.resolve(tasks[i]).then(
        (res) => {
          result[i] = res;
          if (count++ === tasks.length) {
            resolve(result)
          }
        },
        (err) => {
          reject(err);
          return;
        }
      )
    }
  })
}

export const myPromiseResolve = (tasks: Promise<any>[]) => {
  return new Promise<any>((resolve, reject) => {
    for (let task of tasks) {
      Promise.resolve(task).then(
        (res) => {
          resolve(res)
        },
        (err) => {
          reject(err);
          return;
        }
      )
    }
  })
}

