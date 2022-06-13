export const insertionSort = <T>(arr: T[]): T[] => {
  const len = arr.length - 1;
  let temp;
  for (let i = 0; i <= len; i++) {
    temp = arr[i];
    for (let j = i; j >= 0; j--) {
      if (arr[j - 1] > temp) {
        arr[j] = arr[j - 1];
      } else {
        arr[j] = temp;
        break;
      }
    }
  }
  return arr;
};