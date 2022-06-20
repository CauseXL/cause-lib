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

type StartsWith<T extends string, U extends string> = T extends `${U}${infer R}` ? true : false
type EndWith<T extends string, U extends string> = T extends `${infer R}${U}` ? true : false;

type BEM<B extends string, E extends string[], M extends string[]> =
  `${B}${E['length'] extends 0 ? '' : `__${E[number]}`}${M['length'] extends 0 ? '' : `--${M[number]}`}`
type Trimed = TrimRight<'   Hello World    '> // expected to be '   Hello World'
type capitalized = Capitalize<"hello world">; // Hello world
type stringLen = LengthOfString<"Hello">; // 5
type highfen = KebabCase<"HelloWorld">; // hello-world
type className = BEM<'btn', ['price', 'alert'], ['blue', 'red']>;
type a = StartsWith<'abc', 'ac'> // expected to be false
type aa = EndWith<"abc", "bc">; // expected to be true


export {};
