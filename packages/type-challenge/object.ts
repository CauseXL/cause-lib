type Merge<T, U> = {
  [P in keyof T | keyof U]: P extends keyof U
    ? U[P]
    : P extends keyof T
    ? T[P]
    : never
}

type Replace<T, U, R> = {
  [P in keyof T]: P extends U ? P extends keyof R ? R[P] : never : T[P]
}

type PickByType<T, U> = {
  [P in keyof T as (T[P] extends U ? P : never)]: T[P] extends U ? U : never;
};


// * ------------------------------------------------

type foo = {
  name: string;
  age: string;
};
type coo = {
  age: number;
  sex: string;
};

type a = Merge<foo, coo>;

type ReplacedNodes = Replace<
  foo,
  "name" | "age",
  { name: number; age: Object }
>;

type OnlyBoolean = PickByType<
  {
    name: string;
    count: number;
    isReadonly: boolean;
    isEnable: boolean;
  },
  boolean
>;


export {};
