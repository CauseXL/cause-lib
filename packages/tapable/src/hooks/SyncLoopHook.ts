// 串行同步执行，Loop是循环往复的意思
// 订阅者返回 true 表示继续列表循环
// 返回 undefined 表示结束循环
export class SyncLoopHook {
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
    this.tasks.forEach(task => {
      let ret = true;
      do {
        ret = task(...args)
      } while (ret)
    })
  }
}

// * ------------------------------------------------ 

let hook = new SyncLoopHook('name');
let total = 0;
hook.tap(function(name: string){
	console.log('react',name) 
	return ++total === 3? undefined :'继续学';
})
hook.tap(function(name: string){
	console.log('node',name)
})
hook.tap(function(name: string){
	console.log('node',name)
})
hook.call('hello'); 

// 打印3次react hello
// 然后打印 node hello
// 最后再次打印node hello

