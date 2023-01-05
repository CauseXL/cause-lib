// 串行同步执行，Waterfall是瀑布的意思
// 前一个订阅者的返回值会传给后一个订阅者
export class SyncWaterfallHook {
  tasks: Function[];
  name: string;
  constructor(name: string) {
    this.tasks = []; 
    this.name = name;
  }

  tap(task: Function) {
    this.tasks.push(task)
  }

  call(...args: any) {
    let [first, ...tasks] = this.tasks;
    tasks.reduce((acc, task) => task(acc), first(...args));
  }
}

// * ------------------------------------------------

let queue = new SyncWaterfallHook('name');
queue.tap(function(name: any, age: any){
  console.log(name, age, 1);
  return 1;
});

queue.tap(function(data: any){
  console.log(data , 2);
  return 2;
});

queue.tap(function(data: any){
  console.log(data, 3);
});

queue.call('hello', 25);

// 打印
// hello 25 1
// 1 2
// 2 3
