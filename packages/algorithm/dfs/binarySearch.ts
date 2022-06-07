export const binarySearch = (arr: number[], target: number) => {
  return dfs(arr, target, 0, arr.length - 1);
};

const dfs = (
  arr: number[],
  target: number,
  start: number,
  end: number
): number => {
  if (start > end) return -1;
  const mid = Math.floor((start + end) / 2);
  if (target < arr[mid]) {
    return dfs(arr, target, start, mid - 1);
  } else if (target > arr[mid]) {
    return dfs(arr, target, mid + 1, end);
  } else {
    return mid;
  }
};

export const normalBinarySearch = (arr: number[], target: number) => {
  let lo = 0;
  let hi = arr.length - 1;
  while (lo <= hi) {
    let mid = lo + Math.floor((hi - lo) / 2);
    if (arr[mid] < target) {
      lo = mid + 1;
    } else if (arr[mid] > target) {
      hi = mid - 1;
    } else {
      return mid;
    }
  }
  return -1;
};

export const reverseString = (s: string): string => {
  let n = s.length;
  if (n <= 1) return s;
  let a = s.substring(0, Math.floor(n / 2));
  let b = s.substring(Math.floor(n / 2), n);
  return reverseString(b) + reverseString(a);
};
