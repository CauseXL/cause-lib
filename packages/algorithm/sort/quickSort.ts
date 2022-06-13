import { swap } from "../utils/swap";

export const quickSort = <T>(arr: T[]): T[] => {
  sort(arr, 0, arr.length - 1);
  return arr;
};

const sort = <T>(arr: T[], start: number, end: number) => {
  if (start >= end) return;
  const pivot = partition(arr, start, end);
  console.log(pivot);
  sort(arr, start, pivot - 1);
  sort(arr, pivot + 1, end);
};

const partition = <T>(arr: T[], start: number, end: number): number => {
  const p = arr[start];
  let i = start + 1;
  let j = end;
  while (true) {
    while (arr[i] < p && i < end) {
      i++;
    }
    while (arr[j] > p && j > start) {
      j--;
    }
    if (i >= j) break;
    swap(arr, i, j);
  }
  swap(arr, start, j);
  return j;
};
