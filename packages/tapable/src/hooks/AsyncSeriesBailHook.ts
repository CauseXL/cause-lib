// 串行异步执行，bail是保险丝的意思
// 任务如果return，或者reject，则阻塞了
// - https://juejin.cn/post/6989815456416661534#heading-10
export class AsyncSeriesBailHook {
  tasks: Function[];
  name: string;
  constructor(name: string) {
    this.tasks=[];
    this.name = name;
  }

  tapPromise(task: any) {
    this.tasks.push(task);
  }

  promise(...args: any) {
    const [first, ...tasks] = this.tasks;
    return new Promise<void>((resolve, reject) => {
      tasks.reduce((acc, task, index, arr) => {
        return acc.then(() => task(...args))
                  .catch(((err: any) => {
                    arr.splice(index, arr.length - index);
                    reject(err)
                  })).then(()=>{
                    (arr.length === 0) && resolve();
                  })
      }, first(...args))
    })
  }
}


// * ------------------------------------------------

let queue = new AsyncSeriesBailHook('name');

queue.tapPromise(function(name: any){
  return new Promise<void>(function(resolve){
    setTimeout(function(){
      console.log(1);
      resolve();
    }, 1000)
  });
});

queue.tapPromise(function(name: any){
  return new Promise<void>(function(resolve, reject){
    setTimeout(function(){
      console.log(2);
      reject();   // 使用reject那么就会直接跳出后面的逻辑
    }, 2000)
  });
});

queue.tapPromise(function(name: string){
  return new Promise<void>(function(resolve){
    setTimeout(function(){
      console.log(3);
      resolve();
    }, 3000)
  });
});

queue.promise('hello')
// 打印
// 1
// 2
