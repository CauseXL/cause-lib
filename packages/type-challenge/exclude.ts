type MyExclude<T, K extends T> = T extends K ? never : T;

type ALL = 'a' | 'b' | 'c';
type A = MyExclude<ALL, "c">;

// * ------------------------------------------------ 

type MyExtract<T, K> = T extends K ? T : never;

type B = MyExtract<"a" | "b" | "c", "a" | "f">;

export {}