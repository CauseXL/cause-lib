export class AsyncSeriesWaterfallHook {
  tasks: Function[];
  name: string;
  constructor(name: string) {
    this.tasks=[];
    this.name = name;
  }

  tapPromise(task: any) {
    this.tasks.push(task);
  }

  promise(args: any) {
    const [first, ...tasks] = this.tasks;
    return tasks.reduce((acc, task) => {
      return acc.then((res: any) => {
        return res ? task(res) : task(...args);
      })
    }, first(...args))
  }
}


// * ------------------------------------------------

let queue = new AsyncSeriesWaterfallHook('name');

queue.tapPromise(function(name: any){
  return new Promise<void>(function(resolve){
    setTimeout(function(){
      console.log(1);
      resolve();
    }, 1000)
  });

});

queue.tapPromise(function(name: any){
  return new Promise<void>(function(resolve){
    setTimeout(function(){
      console.log(2);
      resolve();
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
// 3
