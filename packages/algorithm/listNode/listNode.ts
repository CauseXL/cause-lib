export class ListNode<T> {
  item: T;
  next: ListNode<T> | null;
  constructor(item: T) {
    this.item = item;
    this.next = null;
  }
}

export const insertHead = <T>(node: ListNode<T>, list: ListNode<T>) => {
  node.next = list;
  return node;
};

export const removeHead = <T>(list: ListNode<T>) => {
  const newList = list.next;
  return newList;
};

export const insertTail = <T>(node: ListNode<T>, list: ListNode<T>) => {
  for (let i = list; i !== null; i = i.next) {
    if (i.next === null) {
      i.next = node;
      break;
    }
  }
  return list;
};

export const removeTail = <T>(list: ListNode<T> | null) => {
  let cur = list;
  if (cur === null) return;

  let next = cur.next;
  if (next === null) {
    cur = null;
  } else {
    while (next.next !== null) {
      cur = next;
      next = next.next
    }
    cur.next = null;
  }
  return list;
}

const first = new ListNode(1)
const second = new ListNode(1)
const third = new ListNode(1)

first.next = second;
second.next = third;

