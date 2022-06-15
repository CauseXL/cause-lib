type MyLast<T> = T extends [...infer A, infer R] ? R : never;
type MyPop<T> = T extends [...infer A, infer R] ? A : never;

type arr1 = ["a", "b", "c"];
type a = MyLast<arr1>;
type b = MyPop<arr1>;

// * --------------------------------------------------

type Tupple<T extends any[]> = T[number];

type Arr = ["1", "2", "3"];
type c = Tupple<Arr>;

export {}
