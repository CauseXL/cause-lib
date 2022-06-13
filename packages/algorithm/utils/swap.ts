export const swap = <T>(arr: T[], left: number, right: number): T[] => {
  return [arr[left], arr[right]] = [arr[right], arr[left]];
}