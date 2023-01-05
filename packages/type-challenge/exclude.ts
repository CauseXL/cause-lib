type MyExclude<T, K extends T> = T extends K ? never : T;

type ALL = 'a' | 'b' | 'c';
type A = MyExclude<ALL, "c">;

type ccc = 'a' | 'b' | 'c' extends 'c' ? 'aa' : 'bb';

// * ------------------------------------------------ 

type MyExtract<T, K> = T extends K ? T : never;

type B = MyExtract<"a" | "b" | "c", "a" | "f">;

interface Example {
  a: string;
  b: number;
  c: number;
  d: string;
}

type FilterType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
}

type newExample = FilterType<Example, string>

export {}