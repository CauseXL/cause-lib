type AppendArgument<T extends (...args: any) => any, U> = (...args: [...Parameters<T>, U]) => ReturnType<T>

type Fn = (a: number, b: string) => number;

type Result = AppendArgument<Fn, boolean>;

export {}
