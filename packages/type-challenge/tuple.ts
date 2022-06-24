type TupleToObject<T extends readonly any[]> = {
  [K in T[number]]: K;
};
type TupleToUnion<T extends any[]> = T[number];
type Length<T extends any[]> = T["length"];

// * ------------------------------------------------ 

type Arr = ["1", "2", "3"];
const tuple = ["tesla", "model 3", "model X", "model Y"] as const;

type result = TupleToObject<typeof tuple>;
type teslaLength = Length<Arr>;
type Test = TupleToUnion<Arr>;

export {};
