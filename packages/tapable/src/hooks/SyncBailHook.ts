// 串行同步执行，bail是保险丝的意思
// 有一个返回值不为null则跳过剩下的逻辑

export class SyncBailHook {
  tasks: Function[];
  name: string;
  constructor(name: string) {
    this.tasks = []; 
    this.name = name;
  }

  tap(task: Function) {
    this.tasks.push(task)
  }

  call(...args: any[]) {
    let i = 0, ret;
    do {
      ret = this.tasks[i++](...arguments);
    } while (!ret)
  }
}

let queue = new SyncBailHook('name');

queue.tap(function(name: any){
  console.log(name,1);
  return 'Wrong';
});

queue.tap(function(name: any){
  console.log(name,2);
});

queue.tap(function(name: any){
  console.log(name,3);
});

queue.call('hello');

// 打印
// hello 1
