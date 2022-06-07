import { ListNode } from './listNode';

// 链表实现的栈
export class StackNode<T> {
  #size: number;
  #first: ListNode<T> | null;
  constructor() {
    this.#size = 0;
    this.#first = null;
  }
  push(item: T) {
    const node = new ListNode(item);
    const oldFirst = this.#first;
    this.#first = node;
    this.#first.next = oldFirst;
    this.#size++;
  }
  pop() {
    if (this.#first) {
      const item = this.#first.item;
      this.#first = this.#first.next;
      this.#size--;
      return item;
    }
    return null;
  }
  isEmpty() {
    return this.#first === null;
  }
  getSize() {
    return this.#size;
  }
  getFirst() {
    return this.#first;
  }
}