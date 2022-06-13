import { swap } from "../utils/swap";

/** 
 * make 大顶堆 
 * 根顶 与 最后一位交换 
 * 全部交换完，就从小到大排序成功了
 */
export const heapSort = <T>(arr: T[]): T[] => {
  const len = arr.length;
  const index = Math.floor(len / 2 - 1);
  /** 初始化大顶堆，从第一个非叶子结点开始 */
  for (let i = index; i >= 0; i--) {
    sink(arr, i, len);
  }
  /** 根顶(最大的值) 与 最后一位交换  */
  for (let i = len - 1; i > 0; i--) {
    swap(arr, 0, i);
    sink(arr, 0, i);
  }
  return arr;
};

const sink = <T>(arr: T[], index: number, len: number) => {
  let temp = arr[index];
  const left = 2 * index + 1;
  for (let i = left; i < len; i = 2 * i + 1) {
    temp = arr[index];
    if (i + 1 < len && arr[i] < arr[i + 1]) {
      /** 找到两个孩子中较大的一个，再与父节点比较 */
      i++;
    }
    if (arr[i] > temp) {
      /** 如果父节点小于子节点:交换；否则跳出 */
      swap(arr, i, index);
      /** 交换后，temp 的下标变为 i */
      index = i;
    } else {
      break;
    }
  }
};
