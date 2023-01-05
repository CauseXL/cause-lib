// - https://jsbin.com/kezejiy/2/edit?js,console,output
export class Subject {
  listeners: Observer[];
  constructor() {
    this.listeners = [];
  }
  subscribe(observer: Observer) {
    this.listeners.push(observer);
    return () => {
      this.remove(observer);
    }
  }
  remove(observer: Observer) {
    let index = this.listeners.indexOf(observer);
    if (index >= 0) this.listeners.splice(index, 1);
  }
  notify() {
    this.listeners.forEach((observer) => observer.notify());
  }
}

class Observer {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  notify() {
    console.log(`${this.name} has been notified.`);
  }
}

// * ------------------------------------------------ 

let subject = new Subject();

let observer1 = new Observer('semlinker');
let observer2 = new Observer('lolo');

subject.subscribe(observer1);
subject.subscribe(observer2);

subject.notify();

subject.remove(observer1);

subject.notify();

// semlinker has been notified. # 输出一次
// 2(unknown) lolo has been notified. # 输出两次
