### 去除 ts 体操后的 never

``` ts
type OmitBoolean = OmitByType<
  {
    name: string;
    count: number;
    isReadonly: boolean;
    isEnable: boolean;
  },
  boolean
>;
```

``` ts
// 有 never 写法
type OmitByType<T, U> = {
  [P in keyof T]: T[P] extends U ? never : T[P];
};

// console
type OmitBoolean = {
  name: string;
  count: number;
  isReadonly: never;
  isEnable: never;
}
```

``` ts
// 没有 never 写法
type OmitByType<T, U> = {
  [P in keyof T as T[P] extends U ? never : P]: T[P];
};

// console
type OmitBoolean = {
  name: string;
  count: number;
}
```