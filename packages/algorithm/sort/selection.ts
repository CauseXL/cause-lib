import { swap } from "../utils/swap";

/** 在未排序序列中找到最小元素，存放到排序序列的起始位置 */
export const selectionSort = <T>(arr: T[]): T[] => {
  const len = arr.length - 1;
  for (let i = 0; i <= len; i++) {
    let min = i;
    for (let j = i + 1; j <= len; j++) {
      if (arr[j] < arr[min]) {
        min = j;
      }
    }
    swap(arr, i, min);
  }
  return arr;
};