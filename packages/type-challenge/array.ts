type MyLast<T> = T extends [...infer A, infer R] ? R : never;
type MyPop<T> = T extends [...infer A, infer R] ? A : never;
type MyPush<T extends any[], K> = [...T, K];

type IndexOf<T, K, U extends any[] = []> =
  T extends [infer A, ...infer R]
    ? A extends K 
      ? U['length']
      : IndexOf<R, K, [...U, 1]> 
    : -1;

type Unique<T, U extends any = never> =
  T extends [infer A, ...infer R]
    ? A extends U
      ? Unique<R, U>
      : [A, ...Unique<R, U | A>]
    : T;

type Reverse<T extends any[]> =
  T extends [infer A, ...infer R]
    ? [...Reverse<R>, A]
    : T;

type Without<T extends any[], U extends any[]> =
  T extends [infer A, ...infer R]
    ? A extends U[number]
      ? Without<R, U>
      : [A, ...Without<R, U>]
    : T;

type Join<T extends any[], U extends string | number> =
  T extends [infer A, ...infer R]
    ? R["length"] extends 0
      ? A
      : `${A & string}${U}${Join<R, U> & string}`
    : T;

type Shift<T extends any[]> = T extends [infer A, ...infer R] ? R : T;

type xxx = (number | string) & string

type arr1 = ["a", "b", "c"];
type aa = 'a' extends arr1 ? number : string // string
// * ---------------- check element in array
type aaa = 'a' extends arr1[number] ? number : string // number

type a = MyLast<arr1>;
type b = MyPop<arr1>;
type Res = Unique<[1, 1, 2, 2, 3, 3]>; // expected to be [1, 2, 3]
type Res1 = IndexOf<[2,6,3,8,4,1,7,3,9], 3>; // expected to be 2
type Res2 = Reverse<['a', 'b']> // ['b', 'a']
type Res3 = MyPush<[1, 2], "3">; // [1, 2, '3']
type Res4 = Without<[1, 2, 4, 1, 5], [1, 2]>; // expected to be [4, 5]
type Res5 = Join<["a", "p", "p", "l", "e"], "-">; // expected to be 'a-p-p-l-e'
type Res6 = Join<["2", "2", "2"], 1>; // 21212
type Res7 = Shift<[3, 2, 1]>; // [2, 1]

// * --------------------------------------------------

type Tupple<T extends any[]> = T[number];

type Arr = ["1", "2", "3"];
type c = Tupple<Arr>;

export {}
