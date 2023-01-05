export class SyncHook {
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
    this.tasks.forEach(task => task(...args));
  }
}

let queue = new SyncHook('name');

queue.tap(function(...args: any[]){ console.log(args); });
queue.tap(function(...args: any[]){ console.log(args); });
queue.tap(function(...args: any[]){ console.log(args); });

queue.call("hello");
// 打印
// ["hello"]
// ["hello"]
// ["hello"]
