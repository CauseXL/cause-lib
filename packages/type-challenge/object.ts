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

type LookUp<T, U> = T extends {
  type: infer P
} ? (
  P extends U ? T : never
) : never

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

interface Cat {
  type: 'cat'
  breeds: 'Abyssinian' | 'Shorthair' | 'Curl' | 'Bengal'
}

interface Dog {
  type: 'dog'
  breeds: 'Hound' | 'Brittany' | 'Bulldog' | 'Boxer'
  color: 'brown' | 'white' | 'black'
}

type MyDog = LookUp<Cat | Dog, 'dog'> // expected to be `Dog`


export {};
