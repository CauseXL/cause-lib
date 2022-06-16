type Capitalize<T extends string> =
  T extends `${infer A}${infer R}`
    ? `${Uppercase<A>}${R}`
    : T;

type TrimRight<T extends string> = T extends `${infer A} ` ? TrimRight<A> : T;
type LengthOfString<S extends string, U extends any[] = []> = 
  S extends `${infer A}${infer R}`
    ? LengthOfString<R, [...U, 1]>
    : U['length'];

type KebabCase<S extends string> =
  S extends `${infer A}${infer R}`
    ? R extends Uncapitalize<R>
      ? `${Uncapitalize<A>}${KebabCase<R>}`
      : `${Uncapitalize<A>}-${KebabCase<R>}`
    : S;



type Trimed = TrimRight<'   Hello World    '> // expected to be '   Hello World'
type capitalized = Capitalize<"hello world">; // Hello world
type stringLen = LengthOfString<"Hello">; // 5
type highfen = KebabCase<"HelloWorld">; // hello-world


export {};
