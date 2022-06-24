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

type RequiredByKeys<T extends {}, U extends keyof T> = {
  [P in Exclude<keyof T, U>]: T[P];
} & Partial<{
  [P in U]: T[P];
}>;

// 新的type有never
type OmitByType1<T, U> = {
  [P in keyof T]: T[P] extends U ? never : T[P];
};

// 没有never
type OmitByType<T, U> = {
  [P in keyof T as T[P] extends U ? never : P]: T[P];
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

interface User {
  name?: string;
  age?: number;
  address?: string;
}

type UserRequiredName = RequiredByKeys<User, "name">; 
type aaa = Pick<User, Exclude<keyof User, "name">>

type OmitBoolean = OmitByType<
  {
    name: string;
    count: number;
    isReadonly: boolean;
    isEnable: boolean;
  },
  boolean
>;

export {};
