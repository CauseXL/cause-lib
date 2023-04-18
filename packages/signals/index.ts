let currentListener: Function | undefined = undefined;

export const createSignal = <T>(initialValue: T) => {
  let value = initialValue;
  let subscribers = new Set<Function>();

  const read = () => {
    if (currentListener !== undefined) {
      subscribers.add(currentListener);
    }
    return value;
  };
  const write = (newValue: T) => {
    value = newValue;
    subscribers.forEach(fn => fn());
  }

  return [read, write];
}

const createEffect = (callback: Function) => {
  currentListener = callback;
  callback();
  currentListener = undefined;
}










