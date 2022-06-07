//* 动态 扩容 / 减容 栈
export class Stack<T> {
  #stack: T[];
  #size: number;
  // * 栈的容量
  MAX = 1;
  constructor() {
    this.#stack = [];
    this.#size = 0;
  }
  push(item: T) {
    if (this.#size >= this.MAX) {
      this.resize(this.MAX * 2);
    }
    this.#stack.push(item);
    this.#size++;
  }
  pop() {
    if (this.#size >= 1) {
      const item = this.#stack[this.#size - 1];
      this.#size--;
      // * 避免对象游离【指手动释放内存】 (java中，js中估计不用考虑)
      // @ts-ignore
      this.#stack[this.#size - 1] = null;
      // * 只要稍加思考，你就明白正确的检测条件是栈大小是否小于数组的四分之一
      if (this.#size > 0 && this.#size < this.MAX / 4) {
        this.resize(this.MAX / 2);
      }
      return item;
    } else {
      // throw new Error("栈为空");
      return null;
    }
  }
  isEmpty() {
    return this.#size === 0;
  }
  getSize() {
    return this.#size;
  }
  resize(max: number) {
    this.MAX = max;
  }
}
