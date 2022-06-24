type TupleToObject<T extends readonly any[]> = {
  [K in T[number]]: K;
};
type TupleToUnion<T extends any[]> = T[number];
type Length<T extends any[]> = T["length"];

type Zip<T, U> = [T, U] extends[[infer A, ...infer RA], [infer B, ...infer RB]] ? [[A, B], ...Zip<RA, RB>] : [];

// * ------------------------------------------------ 

type Arr = ["1", "2", "3"];
const tuple = ["tesla", "model 3", "model X", "model Y"] as const;

type exp = Zip<[1, 2], [true, false]> // expected to be [[1, true], [2, false]]
type result = TupleToObject<typeof tuple>;
type teslaLength = Length<Arr>;
type Test = TupleToUnion<Arr>;

export {};
