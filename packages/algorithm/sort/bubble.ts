import { swap } from "../utils/swap";

export const bubbleSort = <T>(arr: T[]): T[] => {
  const len = arr.length - 1;
  for (let i = len; i > 0; i--) {
    let isChange = false;
    for (let j = 0; j < i; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr, j, j + 1);
        isChange = true;
      }
    }
    if (!isChange) break;
  }
  return arr;
};
