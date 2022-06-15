type MyExclude<T, K extends T> = T extends K ? never : T;

type ALL = 'a' | 'b' | 'c';
type A = MyExclude<ALL, "c">;

export {}