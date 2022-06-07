import { ListNode } from "./listNode";

// 链表实现的队列
export class QueueNode<T> {
  #size: number;
  #first: ListNode<T> | null;
  #last: ListNode<T> | null;
  constructor() {
    this.#size = 0;
    this.#first = null;
    this.#last = null;
  }
  isEmpty() {
    return this.#size === 0;
  }
  enqueue(item: T) {
    const node = new ListNode(item);
    const oldLast = this.#last;
    this.#last = node;
    this.#last.next = null;
    this.#size++;
    if (this.isEmpty()) {
      this.#first = this.#last;
    } else {
      if (oldLast) oldLast.next = this.#last;
    }
  }
  dequeue() {
    const item = this.#first;
    if (this.#first) {
      this.#first = this.#first.next;
      if (this.isEmpty()) this.#last = null;
      this.#size--;
      return item;
    }
    return null;
  }
  getSize() {
    return this.#size;
  }
  getFirst() {
    return this.#last;
  }
}