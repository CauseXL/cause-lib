type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

interface TEST {
  name: string;
  age: number;
  info: Object;
}

type a = MyPick<TEST, "name">;

// * ------------------------------------------------

type MyOmit<T, K extends keyof T> = {
  [P in Exclude<keyof T, K>]: T[P];
}

type MyOmitF<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

// 会有never
type MyOmitA<T, K extends keyof T> = {
  [P in keyof T]: P extends K ? never : T[P];
};

// 没有never
type MyOmitAA<T, K extends keyof T> = {
  // 约束 key
  [P in keyof T as P extends K ? never : P]: P extends K ? never : T[P];
};

// 但这样写仍然不对，我们思路正确，即把 keyof T 中归属于 K 的排除，但因为前后 keyof T 并没有关联，
// 所以需要借助 Exclude 告诉 TS，前后 keyof T 是同一个指代
type MyOmitB<T, K extends keyof T> = {
  [P in (keyof T extends K ? never : keyof T)]: T[P];
};

type b = MyOmit<TEST, "name">;
type bb = MyOmitA<TEST, "name">;
type bb_no_never = MyOmitAA<TEST, "name">;
type bbb = MyOmitB<TEST, "name">;

type f = MyOmitF<TEST, "name">;

export {}
