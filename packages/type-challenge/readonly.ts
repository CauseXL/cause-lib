type A<T, K extends keyof T> = Readonly<Pick<T, K>> & Omit<T, K>

type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends Object ? DeepReadonly<T[K]> : T[K]
}

interface TEST {
  name: string;
  age: number;
  info: Object;
}

type X = {
  x: {
    a: 1;
    b: "hi";
  };
  y: "hey";
};

type a = A<TEST, "name">;
type b = DeepReadonly<X>;

export {}
