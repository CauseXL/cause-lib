export class AsyncParallelHook {
  tasks: Function[];
  name: string;
  constructor(name: string) {
    this.tasks=[];
    this.name = name;
  }

  tapPromise(task: any) {
    this.tasks.push(task);
  }

  promise(name: any) {
    let promises = this.tasks.map(task => task());
    return Promise.all(promises);
  }
}


// * ------------------------------------------------

let queue = new AsyncParallelHook('name');

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
