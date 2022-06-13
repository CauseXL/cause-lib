export const merge = <T>(arr: T[]): T[] => {
  const len = arr.length;
  if (len < 2) return arr;
  const mid = Math.floor(len / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);
  return mergeSort(merge(left), merge(right));
};

const mergeSort = <T>(left: T[], right: T[]): T[] => {
  const result = [];
  while (left.length && right.length) {
    if (left[0] < right[0]) {
      result.push(left.shift() as T);
    } else {
      result.push(right.shift() as T);
    }
  }
  return result.concat(left, right);
};
