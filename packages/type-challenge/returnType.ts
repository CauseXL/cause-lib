const fn = (v: boolean) => {
  if (v) return 1;
  else return 2;
};

type FN = typeof fn;

type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

type aa = MyReturnType<FN>;

export {}